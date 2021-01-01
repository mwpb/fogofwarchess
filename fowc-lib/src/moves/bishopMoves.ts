import { Board } from "../data/Board";
import { Color, getColor } from "../data/Piece";
import { Square, coordinates, addSquare, ordinal } from "../data/Square";

export let bishopMoves = (square: Square, board: Board): Square[] => {
  let color = getColor(board[square]);
  let squares: Square[] = [];
  let [i0, j0] = coordinates(square);

  for (let i = i0 + 1, j = j0 + 1; i < 8 && j < 8; i++, j++) {
    if (!addSquare(ordinal(i, j), squares, color, board)) break;
  }
  for (let i = i0 - 1, j = j0 + 1; i >= 0 && j < 8; i--, j++) {
    if (!addSquare(ordinal(i, j), squares, color, board)) break;
  }
  for (let i = i0 + 1, j = j0 - 1; i < 8 && j >= 0; i++, j--) {
    if (!addSquare(ordinal(i, j), squares, color, board)) break;
  }
  for (let i = i0 - 1, j = j0 - 1; i >= 0 && j >= 0; i--, j--) {
    if (!addSquare(ordinal(i, j), squares, color, board)) break;
  }
  return squares;
};
