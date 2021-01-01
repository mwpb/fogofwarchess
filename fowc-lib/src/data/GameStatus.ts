import { Piece } from "./Piece";
import { Position } from "./Position";

export enum GameStatus {
  WhiteResigns = "white_resigns",
  BlackResigns = "black_resigns",
  Draw = "draw",
  WhiteWins = "white_wins",
  BlackWins = "black_wins",
  InProgress = "in_progress",
  NotPlaying = "not_playing",
}

export let tryFindStatus = (position: Position): GameStatus => {
  if (!position.board.includes("k" as Piece)) return GameStatus.WhiteWins;
  if (!position.board.includes("K" as Piece)) return GameStatus.BlackWins;
  return GameStatus.InProgress;
};
