import { postToServer } from "../utils/httpUtils";
import {
  Color,
  GameStatus,
  getAlgFromMove,
  initialPosition,
  Move,
  parseFen,
  Position,
} from "fowc-lib/dist";
import {
  black_time_left,
  setBlackTimeLeft,
  setWhiteTimeLeft,
  startBlackTimer,
  startWhiteTimer,
  stopBlackTimer,
  stopWhiteTimer,
  white_time_left,
} from "./ChessClock";

export let white_username: string | null = null;
export let black_username: string | null = null;
export let position: Position = initialPosition;
export let user_color = Color.NoColor;
export let is_requesting_human_game = false;
export let game_status: GameStatus = GameStatus.InProgress;
export let colorToMove: Color = Color.White;

export let startComputerGame = async () => {
  return await postToServer("live_games", { command: "start_computer_game" });
};

export let startHumanGame = async () => {
  is_requesting_human_game = true;
  return await postToServer("live_games", { command: "start_human_game" });
};

export let stopGameRequest = async () => {
  is_requesting_human_game = false;
  return await postToServer("live_games", { command: "stop_request" });
};

export let getGame = async () => {
  let { body, status } = await postToServer("live_games", {
    command: "get_game",
  });

  if (400 <= status && status < 500) {
    position = initialPosition;
    white_username = "";
    black_username = "";
    game_status = GameStatus.NotPlaying;
    return;
  }

  if ("white_username" in body) {
    white_username = body.white_username;
  }
  if ("black_username" in body) {
    black_username = body.black_username;
  }
  if ("fen" in body) position = parseFen(body.fen);
  colorToMove = position.colorToMove;

  if ("status" in body) {
    game_status = body.status;
    is_requesting_human_game = false;
  }

  stopWhiteTimer();
  stopBlackTimer();
  if ("white_time_left" in body) setWhiteTimeLeft(body.white_time_left);
  if ("black_time_left" in body) setBlackTimeLeft(body.black_time_left);
  if (colorToMove === Color.White && game_status === GameStatus.InProgress) {
    startWhiteTimer();
  }
  if (colorToMove === Color.Black && game_status === GameStatus.InProgress) {
    startBlackTimer();
  }

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
