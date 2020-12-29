import LiveGame from "App/Models/LiveGame";
import Ws from "App/Services/Ws";
import {
  Position,
  Move,
  toFen,
  getMoveFromAlg,
  move,
  parseFen,
} from "fowc-lib/dist";
import { Engine } from "node-uci";

export let stockfishPlayMove = async (white_username: string) => {
  console.log(`looking up ${white_username}`);

  let liveGame = await LiveGame.findBy("white_username", white_username);

  if (!liveGame) {
    console.log("Stockfish cannot find game.");
    return;
  }
  let position = parseFen(liveGame.fen);
  let moveObj = await getStockfishMove(position);

  let moveResult = move(moveObj, position);
  let newFen = toFen(moveResult.newPosition);
  liveGame.fen = newFen;
  await liveGame.save();
  console.log(`new fen: ${newFen}`);

  Ws.io.to(white_username).emit("update");
};

export let getStockfishMove = async (position: Position): Promise<Move> => {
  let fen = toFen(position);
  let engine = new Engine("/home/mwpb/stockfish/stockfish_20090216_x64_bmi2");
  await engine.init();
  await engine.setoption("MultiPV", "4");
  await engine.isready();
  await engine.position(fen);
  const result = await engine.go({ movetime: 4 });
  await engine.quit();
  return getMoveFromAlg(result.bestmove);
};
