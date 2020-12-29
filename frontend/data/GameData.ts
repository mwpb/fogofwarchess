import { postToServer } from "../utils/httpUtils";
import {
  Color,
  getAlgFromMove,
  initialPosition,
  Move,
  parseFen,
  Position,
} from "fowc-lib/dist";

export let white_username: string | null = null;
export let black_username: string | null = null;
export let position: Position = initialPosition;
export let user_color = Color.White;

export let startComputerGame = async () => {
  return await postToServer("live_games", { command: "start_computer_game" });
};

export let startHumanGame = async () => {
  return await postToServer("live_games", { command: "start_human_game" });
};

export let getGame = async () => {
  let { body, status } = await postToServer("live_games", {
    command: "get_game",
  });

  if (400 <= status && status < 500) {
    position = initialPosition;
    white_username = "";
    black_username = "";
    return;
  }

  if ("white_username" in body) {
    white_username = body.white_username;
  }
  if ("black_username" in body) {
    black_username = body.black_username;
  }
  if ("fen" in body) position = parseFen(body.fen);

  if ("myColor" in body) user_color = body.myColor;
};

export let sendMove = async (move: Move) => {
  let moveString = getAlgFromMove(move);
  return await postToServer("live_games", {
    command: "move",
    move: moveString,
  });
};

export let deleteGame = async () => {
  return await postToServer("live_games", { command: "resign" });
};
