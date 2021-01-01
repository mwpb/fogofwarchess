"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStockfishMove = exports.stockfishPlayMove = void 0;
const LiveGame_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/LiveGame"));
const Ws_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Ws"));
const dist_1 = require("fowc-lib/dist");
const node_uci_1 = require("node-uci");
const liveGameUtils_1 = require("./liveGameUtils");
let stockfishPlayMove = async (white_username) => {
    console.log(`looking up ${white_username}`);
    let liveGame = await LiveGame_1.default.findBy("white_username", white_username);
    if (!liveGame) {
        console.log("Stockfish cannot find game.");
        return;
    }
    let color = liveGame.computer_plays;
    let position = dist_1.parseFen(liveGame.fen);
    let moveObj = await exports.getStockfishMove(position);
    if (!moveObj) {
        console.log("Stockfish resigns.");
        liveGame.status =
            color === dist_1.Color.White ? dist_1.GameStatus.WhiteResigns : dist_1.GameStatus.BlackResigns;
        await liveGame.save();
        Ws_1.default.io.to(white_username).emit("update");
        Ws_1.default.io.to(liveGame.black_username).emit("update");
        return;
    }
    await liveGameUtils_1.makeMove(moveObj, liveGame, position, color);
    if (color === dist_1.Color.White) {
        Ws_1.default.io.to(liveGame.black_username).emit("update");
    }
    else {
        Ws_1.default.io.to(white_username).emit("update");
    }
};
exports.stockfishPlayMove = stockfishPlayMove;
let getStockfishMove = async (position) => {
    let result = null;
    let move = dist_1.findOneMoveWin(position);
    if (move)
        return move;
    try {
        let fen = dist_1.toFen(position);
        let engine = new node_uci_1.Engine("fruit");
        await engine.init();
        await engine.isready();
        await engine.position(fen);
        result = await engine.go({ depth: 4 });
        await engine.quit();
        return dist_1.getMoveFromAlg(result.bestmove);
    }
    catch (err) {
        console.log(err);
        if (result)
            return dist_1.getMoveFromAlg(result.bestmove);
        else
            return null;
    }
};
exports.getStockfishMove = getStockfishMove;
//# sourceMappingURL=stockfish.js.map