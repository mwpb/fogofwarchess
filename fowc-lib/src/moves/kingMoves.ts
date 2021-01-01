import { Board } from "../data/Board";
import { Color, getColor, Piece } from "../data/Piece";
import { Square, addSquare, nudge } from "../data/Square";

export let kingVision = (square: Square, board: Board) => {
  let color = getColor(board[square]);
  let squares: Square[] = [];
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      addSquare(nudge(square, i, j), squares, color, board);
    }
  }
  return squares;
};

export let kingMoves = (
  square: Square,
  board: Board,
  whiteCanCastle: Set<"K" | "Q">,
  blackCanCastle: Set<"k" | "q">
): Square[] => {
  let color = getColor(board[square]);
  let squares: Square[] = [];
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      addSquare(nudge(square, i, j), squares, color, board);
    }
  }

  // Castling moves.
  if (square === Square.E1 && color === Color.White) {
    if (
      board[Square.F1] === Piece.Empty &&
      board[Square.G1] === Piece.Empty &&
      whiteCanCastle.has("K")
    ) {
      addSquare(Square.G1, squares, color, board);
    }
    if (
      board[Square.D1] === Piece.Empty &&
      board[Square.C1] === Piece.Empty &&
      board[Square.B1] === Piece.Empty&&
      whiteCanCastle.has("Q")
    ) {
      addSquare(Square.C1, squares, color, board);
    }
  }
  if (square === Square.E8 && blackCanCastle && color === Color.Black) {
    if (
      board[Square.F8] === Piece.Empty &&
      board[Square.G8] === Piece.Empty &&
      blackCanCastle.has("k")
    ) {
      addSquare(Square.G8, squares, color, board);
    }
    if (
      board[Square.D8] === Piece.Empty &&
      board[Square.C8] === Piece.Empty &&
      board[Square.B8] === Piece.Empty && 
      blackCanCastle.has("q")
    ) {
      addSquare(Square.C8, squares, color, board);
    }
  }
  return squares;
};
