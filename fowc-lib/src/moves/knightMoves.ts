import { Board } from "../data/Board";
import { Color, getColor } from "../data/Piece";
import { Square, addSquare, nudge } from "../data/Square";

export let knightMoves = (square: Square, board: Board): Square[] => {
  let color = getColor(board[square]);
  let squares: Square[] = [];
  addSquare(nudge(square, -2, -1), squares, color, board);
  addSquare(nudge(square, -2, 1), squares, color, board);
  addSquare(nudge(square, -1, -2), squares, color, board);
  addSquare(nudge(square, -1, 2), squares, color, board);
  addSquare(nudge(square, 1, -2), squares, color, board);
  addSquare(nudge(square, 1, 2), squares, color, board);
  addSquare(nudge(square, 2, -1), squares, color, board);
  addSquare(nudge(square, 2, 1), squares, color, board);
  return squares;
};
