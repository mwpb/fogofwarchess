import { bishopMoves } from "../moves/bishopMoves";
import { kingVision } from "../moves/kingMoves";
import { knightMoves } from "../moves/knightMoves";
import { getVision } from "../moves/move";
import { pawnVision } from "../moves/pawnMoves";
import { queenMoves } from "../moves/queenMoves";
import { rookMoves } from "../moves/rookMoves";
import { Board } from "./Board";
import { Color, getColor, Piece } from "./Piece";
import { Square } from "./Square";

export let getHalfBoard = (board: Board, myColor: Color): Board => {
  let halfBoard: Piece[] = [];
  let vision = new Set<Square>();
  for (let i = 0; i < 64; i++) {
    let piece = board[i];
    let color = getColor(piece);
    if (color === myColor) {
      vision.add(i);
      let pieceVision = getVision(i, board);
      for (let square of pieceVision) vision.add(square);
    }
  }
  for (let i = 0; i < 64; i++) {
    if (!vision.has(i)) halfBoard.push(Piece.Fog);
    else halfBoard.push(board[i]);
  }
  return halfBoard;
};
