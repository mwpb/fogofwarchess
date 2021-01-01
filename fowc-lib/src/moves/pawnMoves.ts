import { Board } from "../data/Board";
import { Color, getColor } from "../data/Piece";
import { Square, addSquare, nudge, coordinates } from "../data/Square";

export let pawnVision = (square: Square, board: Board): Square[] => {
  let color = getColor(board[square]);
  let squares: Square[] = [];
  let forwardDriection = 1;
  if (color === Color.White) forwardDriection = -1;

  addSquare(nudge(square, forwardDriection, -1), squares, color, board);
  addSquare(nudge(square, forwardDriection, 1), squares, color, board);

  let oneForward = addSquare(
    nudge(square, forwardDriection, 0),
    squares,
    color,
    board
  );

  if (oneForward) {
    if (color === Color.White && coordinates(square)[0] === 6) {
      addSquare(nudge(square, -2, 0), squares, color, board);
    }
    if (color === Color.Black && coordinates(square)[0] === 1) {
      addSquare(nudge(square, 2, 0), squares, color, board);
    }
  }

  return squares;
};

export let pawnMoves = (
  square: Square,
  board: Board,
  enPassantOneStep: Square | null
): Square[] => {
  let color = getColor(board[square]);
  let squares: Square[] = [];
  let forwardDirection = 1;
  if (color === Color.White) forwardDirection = -1;

  addSquare(
    nudge(square, forwardDirection, -1),
    squares,
    color,
    board,
    true,
    true,
    enPassantOneStep
  );
  addSquare(
    nudge(square, forwardDirection, 1),
    squares,
    color,
    board,
    true,
    true,
    enPassantOneStep
  );

  let oneForward = addSquare(
    nudge(square, forwardDirection, 0),
    squares,
    color,
    board,
    true,
    false
  );

  if (oneForward) {
    if (color === Color.White && coordinates(square)[0] === 6) {
      addSquare(nudge(square, -2, 0), squares, color, board, true, false);
    }
    if (color === Color.Black && coordinates(square)[0] === 1) {
      addSquare(nudge(square, 2, 0), squares, color, board, true, false);
    }
  }

  return squares;
};
