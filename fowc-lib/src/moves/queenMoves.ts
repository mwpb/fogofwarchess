import { Board } from "../data/Board";
import { Color, getColor } from "../data/Piece";
import { Square } from "../data/Square";
import { bishopMoves } from "./bishopMoves";
import { rookMoves } from "./rookMoves";

export let queenMoves = (square: Square, board: Board): Square[] => {
  let color = getColor(board[square]);
  let squares: Square[] = [];
  for (let rookSquare of rookMoves(square, board)) {
    squares.push(rookSquare);
  }
  for (let bishopSquare of bishopMoves(square, board)) {
    squares.push(bishopSquare);
  }
  return squares;
};
