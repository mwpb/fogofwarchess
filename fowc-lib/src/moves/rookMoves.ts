import { Board } from "../data/Board";
import { Color, getColor } from "../data/Piece";
import { Square, coordinates, addSquare, ordinal } from "../data/Square";

export let rookMoves = (square: Square, board: Board): Square[] => {
  let color = getColor(board[square]);
  let squares: Square[] = [];
  let [i0, j0] = coordinates(square);
  for (let i = i0 + 1; i < 8; i++) {
    if (!addSquare(ordinal(i, j0), squares, color, board)) break;
  }
  for (let i = i0 - 1; i >= 0; i--) {
    if (!addSquare(ordinal(i, j0), squares, color, board)) break;
  }
  for (let j = j0 + 1; j < 8; j++) {
    if (!addSquare(ordinal(i0, j), squares, color, board)) break;
  }
  for (let j = j0 - 1; j >= 0; j--) {
    if (!addSquare(ordinal(i0, j), squares, color, board)) break;
  }
  return squares;
};
