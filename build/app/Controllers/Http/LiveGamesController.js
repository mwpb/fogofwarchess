"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logUtils_1 = global[Symbol.for('ioc.use')]("App/Utils/logUtils");
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const dist_1 = require("fowc-lib/dist");
const Ws_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Ws"));
const stockfish_1 = global[Symbol.for('ioc.use')]("App/Utils/stockfish");
const liveGameUtils_1 = global[Symbol.for('ioc.use')]("App/Utils/liveGameUtils");
const GameRequest_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/GameRequest"));
class LiveGamesController {
    async doPost(ctx) {
        logUtils_1.log("Hit LiveGames", ctx);
        const validated = await ctx.request.validate({
            schema: Validator_1.schema.create({
                command: Validator_1.schema.string({ trim: true }),
            }),
        });
        let command = validated.command;
        logUtils_1.log(`Command: ${command}`, ctx);
        let sessionId = ctx.session.sessionId;
        if (command === "start_computer_game") {
            await this.startComputerGame(sessionId, ctx);
        }
        else if (command === "start_human_game") {
            await this.startGame(sessionId, ctx);
        }
        else if (command === "get_game") {
            await this.getGame(sessionId, ctx);
        }
        else if (command === "move") {
            await this.move(sessionId, ctx);
        }
        else if (command === "resign") {
            await this.resign(sessionId, ctx);
        }
        else if (command === "stop_request") {
            this.stopRequest(sessionId, ctx);
        }
        else {
            logUtils_1.log("Command not found.", ctx);
            ctx.response.status(404).send({});
        }
    }
    async startComputerGame(sessionId, ctx) {
        let [white_username, black_username] = liveGameUtils_1.chooseColors(sessionId, `stockfish${new Date().getTime()}`);
        let computerColor = black_username === sessionId ? dist_1.Color.White : dist_1.Color.Black;
        try {
            await liveGameUtils_1.startLiveGame(white_username, black_username, computerColor);
            logUtils_1.log(`START GAME: ${white_username} vs ${black_username}`, ctx);
            ctx.response.status(200).send({});
            return;
        }
        catch (err) {
            logUtils_1.log("Already playing game.", ctx);
            ctx.response.status(403).send({});
            return;
        }
    }
    async startGame(sessionId, ctx) {
        let gameRequests = await GameRequest_1.default.all();
        for (let gameRequest of gameRequests) {
            if (gameRequest.username !== sessionId) {
                let [white_username, black_username] = liveGameUtils_1.chooseColors(sessionId, gameRequest.username);
                await liveGameUtils_1.startLiveGame(white_username, black_username);
                logUtils_1.log(`START GAME: ${white_username} vs ${black_username}`, ctx);
                ctx.response.status(200).send({});
                return;
            }
        }
        try {
            let gameRequest = new GameRequest_1.default();
            gameRequest.username = sessionId;
            await gameRequest.save();
            logUtils_1.log(`GAME REQUEST: ${sessionId}`, ctx);
            ctx.response.status(200).send({});
            return;
        }
        catch (err) {
            logUtils_1.log(`Already have game request for: ${sessionId}`, ctx);
            ctx.response.status(200).send({});
            return;
        }
    }
    async getGame(sessionId, ctx) {
        let [existingGame, color] = await liveGameUtils_1.getExistingGame(sessionId);
        if (existingGame) {
            let position = dist_1.parseFen(existingGame.fen);
            let halfPosition = dist_1.getHalfPosition(position, color);
            logUtils_1.log(`GET GAME: ${sessionId}`, ctx);
            let white_username = existingGame.computer_plays === dist_1.Color.White
                ? existingGame.white_username
                : "you";
            let black_username = existingGame.computer_plays === dist_1.Color.Black
                ? existingGame.black_username
                : "you";
            let time_of_last_move = existingGame.time_of_last_move;
            let white_time_left = existingGame.white_time_left;
            let black_time_left = existingGame.black_time_left;
            if (position.colorToMove === dist_1.Color.White) {
                white_time_left = white_time_left - (Date.now() - time_of_last_move);
                time_of_last_move = Date.now();
            }
            if (position.colorToMove === dist_1.Color.Black) {
                black_time_left = black_time_left - (Date.now() - time_of_last_move);
                time_of_last_move = Date.now();
            }
            let status = existingGame.status;
            if (white_time_left <= 0) {
                white_time_left = 0;
                status = dist_1.GameStatus.BlackWins;
            }
            if (black_time_left <= 0) {
                black_time_left = 0;
                status = dist_1.GameStatus.WhiteWins;
            }
            existingGame.time_of_last_move = time_of_last_move;
            existingGame.white_time_left = white_time_left;
            existingGame.black_time_left = black_time_left;
            existingGame.status = status;
            await existingGame.save();
            ctx.response.status(200).send({
                white_username: white_username,
                black_username: black_username,
                white_time_left: white_time_left,
                black_time_left: black_time_left,
                time_of_last_move: time_of_last_move,
                status: status,
                myColor: color,
                fen: dist_1.toFen(halfPosition),
            });
            return;
        }
        logUtils_1.log(`${sessionId} is not playing a game`, ctx);
        ctx.response.status(404).send({});
        return;
    }
    async move(sessionId, ctx) {
        const validated = await ctx.request.validate({
            schema: Validator_1.schema.create({
                move: Validator_1.schema.string({ trim: true }),
            }),
        });
        let moveString = validated.move;
        let [existingGame, color] = await liveGameUtils_1.getExistingGame(sessionId);
        if (!existingGame) {
            logUtils_1.log(`${sessionId} is not playing a game`, ctx);
            ctx.response.status(404).send({});
            return;
        }
        let position = dist_1.parseFen(existingGame.fen);
        if (position.colorToMove !== color) {
            logUtils_1.log(`It is not your turn ${sessionId}`, ctx);
            ctx.response.status(403).send({});
            return;
        }
        let moveObj = dist_1.getMoveFromAlg(moveString);
        let moveResult = await liveGameUtils_1.makeMove(moveObj, existingGame, position, color);
        let computerColor = existingGame.computer_plays;
        if (moveResult.newPosition.colorToMove === computerColor) {
            stockfish_1.stockfishPlayMove(existingGame.white_username);
        }
        Ws_1.default.io.to(existingGame.white_username).emit("update");
        Ws_1.default.io.to(existingGame.black_username).emit("update");
        logUtils_1.log(`Played move ${moveString}`, ctx);
        ctx.response.status(200).send({});
        return;
    }
    async resign(sessionId, ctx) {
        let [existingGame, color] = await liveGameUtils_1.getExistingGame(sessionId);
        if (existingGame && color === dist_1.Color.White) {
            existingGame.status = dist_1.GameStatus.WhiteResigns;
            await existingGame.save();
        }
        if (existingGame && color === dist_1.Color.Black) {
            existingGame.status = dist_1.GameStatus.BlackResigns;
            await existingGame.save();
        }
        if (existingGame) {
            Ws_1.default.io.to(existingGame.white_username).emit("update");
            Ws_1.default.io.to(existingGame.black_username).emit("update");
        }
        logUtils_1.log(`${sessionId} resigns game`, ctx);
        ctx.response.status(200).send({});
        return;
    }
    async stopRequest(sessionId, ctx) {
        let existingRequest = await GameRequest_1.default.findBy("username", sessionId);
        if (existingRequest) {
            await existingRequest.delete();
            logUtils_1.log(`Deleted gameRequest for ${sessionId}`, ctx);
        }
        else {
            logUtils_1.log(`No gameRequests to delete for ${sessionId}`, ctx);
        }
        ctx.response.status(200).send({});
        return;
    }
}
exports.default = LiveGamesController;
//# sourceMappingURL=LiveGamesController.js.map