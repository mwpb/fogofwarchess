import GameRequest from "App/Models/GameRequest";
import LiveGame from "App/Models/LiveGame";
import Ws from "App/Services/Ws";
import { Color, initialPosition, toFen } from "fowc-lib/dist";
import { stockfishPlayMove } from "./stockfish";

export let startLiveGame = async (
  white_username: string,
  black_username: string,
  computerColor: Color = Color.NoColor
): Promise<LiveGame | null> => {
  let existing_white_game = await LiveGame.findBy(
    "white_username",
    white_username
  );
  if (existing_white_game) return null;
  let existing_black_game = await LiveGame.findBy(
    "black_username",
    black_username
  );
  if (existing_black_game) return null;

  let liveGame = new LiveGame();
  liveGame.white_username = white_username;
  liveGame.black_username = black_username;
  liveGame.fen = toFen(initialPosition);
  liveGame.computer_plays = computerColor;

  // Remove game requests
  let whiteGameRequest = await GameRequest.findBy("username", white_username);
  if (whiteGameRequest) await whiteGameRequest.delete();
  let blackGameRequest = await GameRequest.findBy("username", black_username);
  if (blackGameRequest) await blackGameRequest.delete();

  // Notify participants
  if (computerColor === Color.White) stockfishPlayMove(white_username);
  if (computerColor === Color.Black) Ws.io.to(white_username).emit("update");
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
