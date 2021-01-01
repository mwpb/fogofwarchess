import LiveGame from "App/Models/LiveGame";
import Ws from "App/Services/Ws";
import {
  Position,
  Move,
  toFen,
  getMoveFromAlg,
  parseFen,
  Color,
  GameStatus,
  findOneMoveWin,
} from "fowc-lib/dist";
import { Engine, SearchResult } from "node-uci";
import { makeMove } from "./liveGameUtils";

export let stockfishPlayMove = async (white_username: string) => {
  console.log(`looking up ${white_username}`);

  let liveGame = await LiveGame.findBy("white_username", white_username);

  if (!liveGame) {
    console.log("Stockfish cannot find game.");
    return;
  }

  let color = liveGame.computer_plays;

  let position = parseFen(liveGame.fen);
  let moveObj = await getStockfishMove(position);
  if (!moveObj) {
    console.log("Stockfish resigns.");
    liveGame.status =
      color === Color.White ? GameStatus.WhiteResigns : GameStatus.BlackResigns;
    await liveGame.save();
    Ws.io.to(white_username).emit("update");
    Ws.io.to(liveGame.black_username).emit("update");
    return;
  }

  await makeMove(moveObj, liveGame, position, color);

  if (color === Color.White) {
    Ws.io.to(liveGame.black_username).emit("update");
  } else {
    Ws.io.to(white_username).emit("update");
  }
};

export let getStockfishMove = async (
  position: Position
): Promise<Move | null> => {
  let result: SearchResult | null = null;
  let move = findOneMoveWin(position);
  if (move) return move;
  try {
    let fen = toFen(position);
    // let engine = new Engine("../stockfish/stockfish_20090216_x64_bmi2");
    let engine = new Engine("fruit");
    await engine.init();
    await engine.isready();
    await engine.position(fen);
    result = await engine.go({ depth: 4 });
    await engine.quit();
    return getMoveFromAlg(result.bestmove);
  } catch (err) {
    console.log(err);
    // engine resigns
    if (result) return getMoveFromAlg(result.bestmove);
    else return null;
  }
};
