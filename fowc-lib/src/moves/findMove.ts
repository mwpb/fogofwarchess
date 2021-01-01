import { getColor, getVision, Move } from "..";
import { Piece } from "../data/Piece";
import { Position } from "../data/Position";

export let findOneMoveWin = (position: Position): Move | null => {
  let board = position.board;
  for (let i = 0; i < 64; i++) {
    if (getColor(board[i]) === position.colorToMove) {
      let pieceVision = getVision(i, board);
      for (let square of pieceVision) {
        let piece = board[square];
        if (piece.toUpperCase() === "K")
          return {
            fromSquare: i,
            toSquare: square,
            promotionPiece: Piece.Empty,
          };
      }
    }
  }
  return null;
};
