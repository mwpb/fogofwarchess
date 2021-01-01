import GameRequest from "App/Models/GameRequest";
import LiveGame from "App/Models/LiveGame";
import Ws from "App/Services/Ws";
import {
  Color,
  initialPosition,
  Move,
  move,
  MoveResult,
  Position,
  toFen,
  GameStatus,
  tryFindStatus,
} from "fowc-lib/dist";
import { stockfishPlayMove } from "./stockfish";

export let startLiveGame = async (
  white_username: string,
  black_username: string,
  computerColor: Color = Color.NoColor
): Promise<LiveGame | null> => {
  let [existing_white_game] = await getExistingGame(white_username);
  if (existing_white_game) {
    if (existing_white_game.status === GameStatus.InProgress) {
      Ws.io.to(white_username).emit("update");
      Ws.io.to(black_username).emit("update");
      return null;
    }
    await existing_white_game.delete();
  }
  let [existing_black_game] = await getExistingGame(black_username);
  if (existing_black_game) {
    if (existing_black_game.status === GameStatus.InProgress) {
      Ws.io.to(white_username).emit("update");
      Ws.io.to(black_username).emit("update");
      return null;
    }
    await existing_black_game.delete();
  }

  let liveGame = new LiveGame();
  liveGame.white_username = white_username;
  liveGame.black_username = black_username;
  liveGame.fen = toFen(initialPosition);
  liveGame.computer_plays = computerColor;
  liveGame.white_time_left = 5 * 60 * 1000;
  liveGame.black_time_left = 5 * 60 * 1000;
  liveGame.time_of_last_move = Date.now();
  liveGame.status = GameStatus.InProgress;
  await liveGame.save();

  // Remove game requests
  let whiteGameRequest = await GameRequest.findBy("username", white_username);
  if (whiteGameRequest) await whiteGameRequest.delete();
  let blackGameRequest = await GameRequest.findBy("username", black_username);
  if (blackGameRequest) await blackGameRequest.delete();

  // Notify participants
  if (computerColor === Color.White) {
    Ws.io.to(black_username).emit("update");
    stockfishPlayMove(white_username);
  }
  if (computerColor === Color.Black) {
    Ws.io.to(white_username).emit("update");
  }
  if (computerColor === Color.NoColor) {
    Ws.io.to(white_username).emit("update");
    Ws.io.to(black_username).emit("update");
  }

  await liveGame.save();
  return liveGame;
};

export let getExistingGame = async (
  username: string
): Promise<[LiveGame | null, Color]> => {
  // Check if black has existing game
  let existing_black_game = await LiveGame.findBy("black_username", username);
  if (existing_black_game) {
    return [existing_black_game, Color.Black];
  }

  // Check if white has existing game
  let existing_white_game = await LiveGame.findBy("white_username", username);
  return [existing_white_game, Color.White];
};

export let chooseColors = (name1: string, name2: string) => {
  if (Math.random() < 0.5) return [name2, name1];
  return [name1, name2];
};

export let makeMove = async (
  moveObj: Move,
  existingGame: LiveGame,
  position: Position,
  color: Color
): Promise<MoveResult> => {
  if (existingGame.status !== GameStatus.InProgress) {
    return { newPosition: position, message: "Game is over." };
  }

  if (color === Color.White) {
    if (
      existingGame.white_time_left <=
      Date.now() - existingGame.time_of_last_move
    ) {
      existingGame.status = GameStatus.BlackWins;
      await existingGame.save();
      return { newPosition: position, message: "White out of time" };
    }
    existingGame.white_time_left =
      existingGame.white_time_left -
      (Date.now() - existingGame.time_of_last_move);
  } else if (color === Color.Black) {
    if (
      existingGame.black_time_left <=
      Date.now() - existingGame.time_of_last_move
    ) {
      existingGame.status = GameStatus.WhiteWins;
      await existingGame.save();
      return { newPosition: position, message: "Black out of time" };
    }
    existingGame.black_time_left =
      existingGame.black_time_left -
      (Date.now() - existingGame.time_of_last_move);
  }

  let moveResult = move(moveObj, position);
  let newFen = toFen(moveResult.newPosition);
  existingGame.fen = newFen;

  existingGame.time_of_last_move = Date.now();
  existingGame.status = tryFindStatus(moveResult.newPosition);

  await existingGame.save();

  return moveResult;
};
