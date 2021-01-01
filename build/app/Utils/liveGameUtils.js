"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeMove = exports.chooseColors = exports.getExistingGame = exports.startLiveGame = void 0;
const GameRequest_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/GameRequest"));
const LiveGame_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/LiveGame"));
const Ws_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Ws"));
const dist_1 = require("fowc-lib/dist");
const stockfish_1 = require("./stockfish");
let startLiveGame = async (white_username, black_username, computerColor = dist_1.Color.NoColor) => {
    let [existing_white_game] = await exports.getExistingGame(white_username);
    if (existing_white_game) {
        if (existing_white_game.status === dist_1.GameStatus.InProgress) {
            Ws_1.default.io.to(white_username).emit("update");
            Ws_1.default.io.to(black_username).emit("update");
            return null;
        }
        await existing_white_game.delete();
    }
    let [existing_black_game] = await exports.getExistingGame(black_username);
    if (existing_black_game) {
        if (existing_black_game.status === dist_1.GameStatus.InProgress) {
            Ws_1.default.io.to(white_username).emit("update");
            Ws_1.default.io.to(black_username).emit("update");
            return null;
        }
        await existing_black_game.delete();
    }
    let liveGame = new LiveGame_1.default();
    liveGame.white_username = white_username;
    liveGame.black_username = black_username;
    liveGame.fen = dist_1.toFen(dist_1.initialPosition);
    liveGame.computer_plays = computerColor;
    liveGame.white_time_left = 5 * 60 * 1000;
    liveGame.black_time_left = 5 * 60 * 1000;
    liveGame.time_of_last_move = Date.now();
    liveGame.status = dist_1.GameStatus.InProgress;
    await liveGame.save();
    let whiteGameRequest = await GameRequest_1.default.findBy("username", white_username);
    if (whiteGameRequest)
        await whiteGameRequest.delete();
    let blackGameRequest = await GameRequest_1.default.findBy("username", black_username);
    if (blackGameRequest)
        await blackGameRequest.delete();
    if (computerColor === dist_1.Color.White)
        stockfish_1.stockfishPlayMove(white_username);
    if (computerColor === dist_1.Color.Black)
        Ws_1.default.io.to(white_username).emit("update");
    if (computerColor === dist_1.Color.NoColor) {
        Ws_1.default.io.to(white_username).emit("update");
        Ws_1.default.io.to(black_username).emit("update");
    }
    await liveGame.save();
    return liveGame;
};
exports.startLiveGame = startLiveGame;
let getExistingGame = async (username) => {
    let existing_black_game = await LiveGame_1.default.findBy("black_username", username);
    if (existing_black_game) {
        return [existing_black_game, dist_1.Color.Black];
    }
    let existing_white_game = await LiveGame_1.default.findBy("white_username", username);
    return [existing_white_game, dist_1.Color.White];
};
exports.getExistingGame = getExistingGame;
let chooseColors = (name1, name2) => {
    if (Math.random() < 0.5)
        return [name2, name1];
    return [name1, name2];
};
exports.chooseColors = chooseColors;
let makeMove = async (moveObj, existingGame, position, color) => {
    if (existingGame.status !== dist_1.GameStatus.InProgress) {
        return { newPosition: position, message: "Game is over." };
    }
    if (color === dist_1.Color.White) {
        if (existingGame.white_time_left <=
            Date.now() - existingGame.time_of_last_move) {
            existingGame.status = dist_1.GameStatus.BlackWins;
            await existingGame.save();
            return { newPosition: position, message: "White out of time" };
        }
        existingGame.white_time_left =
            existingGame.white_time_left -
                (Date.now() - existingGame.time_of_last_move);
    }
    else if (color === dist_1.Color.Black) {
        if (existingGame.black_time_left <=
            Date.now() - existingGame.time_of_last_move) {
            existingGame.status = dist_1.GameStatus.WhiteWins;
            await existingGame.save();
            return { newPosition: position, message: "Black out of time" };
        }
        existingGame.black_time_left =
            existingGame.black_time_left -
                (Date.now() - existingGame.time_of_last_move);
    }
    let moveResult = dist_1.move(moveObj, position);
    let newFen = dist_1.toFen(moveResult.newPosition);
    existingGame.fen = newFen;
    existingGame.time_of_last_move = Date.now();
    existingGame.status = dist_1.tryFindStatus(moveResult.newPosition);
    await existingGame.save();
    return moveResult;
};
exports.makeMove = makeMove;
//# sourceMappingURL=liveGameUtils.js.map