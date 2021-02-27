import { Board } from "../data/Board";
import { Rank } from "../data/FileRank";
import { Color, getColor, Piece } from "../data/Piece";
import { clonePosition, Position } from "../data/Position";
import { coordinates, fromAlg, nudge, Square, toAlg } from "../data/Square";
import { bishopMoves } from "./bishopMoves";
import { kingMoves, kingVision } from "./kingMoves";
import { knightMoves } from "./knightMoves";
import { pawnMoves, pawnVision } from "./pawnMoves";
import { queenMoves } from "./queenMoves";
import { rookMoves } from "./rookMoves";

export type Move = {
  fromSquare: Square;
  toSquare: Square;
  promotionPiece: Piece;
};

export type MoveResult = {
  newPosition: Position;
  message: string;
};

export let getMoveFromAlg = (alg: string): Move => {
  let fromSquare = fromAlg(alg.substring(0, 2));
  let toSquare = fromAlg(alg.substring(2, 4));

  let promotionPiece = Piece.Empty;
  if (
    alg.length === 5 &&
    ["R", "N", "B", "Q", "K", "P"].includes(alg.charAt(4).toUpperCase())
  )
    promotionPiece = alg[4] as Piece;

  return {
    fromSquare: fromSquare,
    toSquare: toSquare,
    promotionPiece: promotionPiece,
  };
};

export let getAlgFromMove = (move: Move): string => {
  let fromString = toAlg(move.fromSquare);
  let toString = toAlg(move.toSquare);
  let promotionString =
    move.promotionPiece === Piece.Empty ? "" : move.promotionPiece;
  return `${fromString}${toString}${promotionString}`;
};

export let getMoves = (fromSquare: Square, position: Position) => {
  let moves: Square[] = [];
  let board = position.board;
  let piece = board[fromSquare];
  if (piece === Piece.WhiteRook || piece === Piece.BlackRook) {
    moves = rookMoves(fromSquare, board);
  } else if (piece === Piece.WhiteKnight || piece === Piece.BlackKnight) {
    moves = knightMoves(fromSquare, board);
  } else if (piece === Piece.WhiteBishop || piece === Piece.BlackBishop) {
    moves = bishopMoves(fromSquare, board);
  } else if (piece === Piece.WhiteKing || piece === Piece.BlackKing) {
    let whiteCanCastle = position.whiteCanCastle;
    let blackCanCastle = position.blackCanCastle;
    moves = kingMoves(fromSquare, board, whiteCanCastle, blackCanCastle);
  } else if (piece === Piece.WhiteQueen || piece === Piece.BlackQueen) {
    moves = queenMoves(fromSquare, board);
  } else if (piece === Piece.WhitePawn || piece === Piece.BlackPawn) {
    moves = pawnMoves(fromSquare, board, position.enPassantOneStep);
  }
  return moves;
};

export let getVision = (fromSquare: Square, board: Board) => {
  let moves: Square[] = [];
  let piece = board[fromSquare];
  if (piece === Piece.WhiteRook || piece === Piece.BlackRook) {
    moves = rookMoves(fromSquare, board);
  } else if (piece === Piece.WhiteKnight || piece === Piece.BlackKnight) {
    moves = knightMoves(fromSquare, board);
  } else if (piece === Piece.WhiteBishop || piece === Piece.BlackBishop) {
    moves = bishopMoves(fromSquare, board);
  } else if (piece === Piece.WhiteKing || piece === Piece.BlackKing) {
    moves = kingVision(fromSquare, board);
  } else if (piece === Piece.WhiteQueen || piece === Piece.BlackQueen) {
    moves = queenMoves(fromSquare, board);
  } else if (piece === Piece.WhitePawn || piece === Piece.BlackPawn) {
    moves = pawnVision(fromSquare, board);
  }
  return moves;
};

/**
 * Attempts to make a move in the given position.
 * Returns an object containing the new position and a string
 * confirming the move. If there is an error the old position
 * is returned and the reason for the error is in the message string.
 * @param fromSquare the square the piece is moving from
 * @param toSquare the square the piece is moving to
 * @param position the position in which the move is being made
 * @param promotionPiece what piece to promote to?
 */
export let move = (move: Move, position: Position): MoveResult => {
  let fromSquare = move.fromSquare;
  let toSquare = move.toSquare;
  let promotionPiece = move.promotionPiece;
  let board: Board = position.board;
  let piece: Piece = board[fromSquare];

  if (getColor(piece) === Color.NoColor) {
    return { newPosition: position, message: "No piece to move." };
  }
  if (getColor(piece) !== position.colorToMove) {
    return { newPosition: position, message: "Not your move." };
  }

  let moves = getMoves(fromSquare, position);

  if (!moves.includes(toSquare)) {
    return { newPosition: position, message: "Cannot move to that square." };
  }

  let newPosition = clonePosition(position);
  newPosition.board[fromSquare] = Piece.Empty;
  newPosition.board[toSquare] = piece;

  // If castles then move rook too.
  if (piece === Piece.WhiteKing) {
    if (fromSquare === Square.E1 && toSquare === Square.G1) {
      newPosition.board[Square.H1] = Piece.Empty;
      newPosition.board[Square.F1] = Piece.WhiteRook;
    }
    if (fromSquare === Square.E1 && toSquare === Square.C1) {
      newPosition.board[Square.A1] = Piece.Empty;
      newPosition.board[Square.D1] = Piece.WhiteRook;
    }
  }
  if (piece === Piece.BlackKing) {
    if (fromSquare === Square.E8 && toSquare === Square.G8) {
      newPosition.board[Square.H8] = Piece.Empty;
      newPosition.board[Square.F8] = Piece.BlackRook;
    }
    if (fromSquare === Square.E8 && toSquare === Square.C8) {
      newPosition.board[Square.A8] = Piece.Empty;
      newPosition.board[Square.D8] = Piece.BlackRook;
    }
  }
  // If King or Rook move then remove castling rights
  if (piece === Piece.WhiteKing) {
    newPosition.whiteCanCastle = new Set();
  } else if (piece === Piece.BlackKing) {
    newPosition.blackCanCastle = new Set();
  } else if (piece === Piece.WhiteRook && fromSquare === Square.A1) {
    newPosition.whiteCanCastle = new Set<"K" | "Q">(position.whiteCanCastle);
    newPosition.whiteCanCastle.delete("Q");
  } else if (piece === Piece.WhiteRook && fromSquare === Square.H1) {
    newPosition.whiteCanCastle = new Set<"K" | "Q">(position.whiteCanCastle);
    newPosition.whiteCanCastle.delete("K");
  } else if (piece === Piece.BlackRook && fromSquare === Square.A8) {
    newPosition.blackCanCastle = new Set<"k" | "q">(position.blackCanCastle);
    newPosition.blackCanCastle.delete("q");
  } else if (piece === Piece.BlackRook && fromSquare === Square.H8) {
    newPosition.blackCanCastle = new Set<"k" | "q">(position.blackCanCastle);
    newPosition.blackCanCastle.delete("k");
  }

  // If promotion then replace with chosen piece.
  let rankOfToSquare = coordinates(toSquare)[0];
  let rankOfFromSquare = coordinates(fromSquare)[0];
  if (piece === Piece.WhitePawn && rankOfToSquare === Rank.Eighth) {
    newPosition.board[toSquare] = promotionPiece;
  }
  if (piece === Piece.BlackPawn && rankOfToSquare === Rank.First) {
    newPosition.board[toSquare] = promotionPiece;
  }

  // If enPassant then remove piece at enPassantTwoStep
  if (toSquare === position.enPassantOneStep && position.enPassantTwoStep) {
    newPosition.board[position.enPassantTwoStep] = Piece.Empty;
  }

  // If pawn moves two steps then add enPassant squares
  if (
    piece === Piece.WhitePawn &&
    rankOfFromSquare === Rank.Second &&
    rankOfToSquare === Rank.Fourth
  ) {
    newPosition.enPassantOneStep = nudge(toSquare, 1, 0);
    newPosition.enPassantTwoStep = toSquare;
  } else if (
    piece === Piece.BlackPawn &&
    rankOfFromSquare === Rank.Seventh &&
    rankOfToSquare === Rank.Fifth
  ) {
    newPosition.enPassantOneStep = nudge(toSquare, -1, 0);
    newPosition.enPassantTwoStep = toSquare;
  } else {
    newPosition.enPassantOneStep = null;
    newPosition.enPassantTwoStep = null;
  }

  newPosition.colorToMove = Color.White;
  if (position.colorToMove === Color.White) {
    newPosition.colorToMove = Color.Black;
  }

  // Reset halfMoveClock if pawn move or capture
  if (
    piece === Piece.BlackPawn ||
    piece === Piece.WhitePawn ||
    board[toSquare] !== Piece.Empty
  ) {
    newPosition.halfMoveClock = 0;
  } else {
    newPosition.halfMoveClock += 1;
  }

  if (newPosition.colorToMove === Color.White) {
    newPosition.fullMoveNumber = position.fullMoveNumber + 1;
  } else {
    newPosition.fullMoveNumber = position.fullMoveNumber;
  }

  return {
    newPosition: newPosition,
    message: `Move: ${fromSquare}:${toSquare}=${promotionPiece}`,
  };
};
