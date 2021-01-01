import {
  Board,
  boardFromFen,
  cloneBoard,
  initialBoard,
} from "./Board";
import { Color } from "./Piece";
import { fromAlg, nudge, ordinal, Square, toAlg } from "./Square";

export type Position = {
  board: Board;
  colorToMove: Color;
  whiteCanCastle: Set<"K" | "Q">;
  blackCanCastle: Set<"k" | "q">;
  enPassantOneStep: Square | null;
  enPassantTwoStep: Square | null;
  halfMoveClock: number;
  fullMoveNumber: number;
};

export let clonePosition = (position: Position): Position => {
  let board = cloneBoard(position.board);
  return {
    board: board,
    colorToMove: position.colorToMove,
    whiteCanCastle: position.whiteCanCastle,
    blackCanCastle: position.blackCanCastle,
    enPassantOneStep: position.enPassantOneStep,
    enPassantTwoStep: position.enPassantTwoStep,
    halfMoveClock: position.halfMoveClock,
    fullMoveNumber: position.fullMoveNumber,
  };
};

export let initialPosition: Position = {
  board: initialBoard,
  colorToMove: Color.White,
  whiteCanCastle: new Set(["K", "Q"]),
  blackCanCastle: new Set(["k", "q"]),
  enPassantOneStep: null,
  enPassantTwoStep: null,
  halfMoveClock: 0,
  fullMoveNumber: 1,
};

export let colorToMoveFromFen = (fen: string): Color => {
  let fields = fen.split(" ");
  return fields[1] === "w" ? Color.White : Color.Black;
};

export let whiteCanCastleFromFen = (fen: string): Set<"K" | "Q"> => {
  let fields = fen.split(" ");
  let whiteCanCastle = new Set<"K" | "Q">();
  if (fields[2].includes("K")) whiteCanCastle.add("K");
  if (fields[2].includes("Q")) whiteCanCastle.add("Q");
  return whiteCanCastle;
};

export let blackCanCastleFromFen = (fen: string): Set<"k" | "q"> => {
  let fields = fen.split(" ");
  let blackCanCastle = new Set<"k" | "q">();
  if (fields[2].includes("k")) blackCanCastle.add("k");
  if (fields[2].includes("q")) blackCanCastle.add("q");
  return blackCanCastle;
};

export let enPassantFromFen = (
  fen: string,
  colorToMove: Color
): [Square | null, Square | null] => {
  let fields = fen.split(" ");
  let enPassantOneStep = null;
  let enPassantTwoStep = null;
  if (fields[3] !== "-") {
    enPassantOneStep = fromAlg(fields[3]);
    let forwardDirection = colorToMove === Color.White ? -1 : 1;
    enPassantTwoStep = nudge(enPassantOneStep, forwardDirection, 0);
  }
  return [enPassantOneStep, enPassantTwoStep];
};

export let parseFen = (fen: string): Position => {
  let fields = fen.split(" ");
  if (fields.length !== 6) return initialPosition;

  let board: Board = boardFromFen(fen);

  let colorToMove = colorToMoveFromFen(fen);

  let whiteCanCastle = whiteCanCastleFromFen(fen);

  let blackCanCastle = blackCanCastleFromFen(fen);

  let [enPassantOneStep, enPassantTwoStep] = enPassantFromFen(fen, colorToMove);

  return {
    board: board,
    colorToMove: colorToMove,
    whiteCanCastle: whiteCanCastle,
    blackCanCastle: blackCanCastle,
    enPassantOneStep: enPassantOneStep,
    enPassantTwoStep: enPassantTwoStep,
    halfMoveClock: Number.parseInt(fields[4]),
    fullMoveNumber: Number.parseInt(fields[5]),
  };
};

export let toFen = (position: Position): string => {
  let fen = "";
  let board = position.board;
  for (let i = 0; i < 8; i++) {
    let emptyCount = 0;
    for (let j = 0; j < 8; j++) {
      let ord = ordinal(i, j);
      if (board[ord] !== " ") {
        if (emptyCount > 0) {
          fen += `${emptyCount}`;
          emptyCount = 0;
        }
        fen += board[ord];
      } else emptyCount++;
    }
    if (emptyCount > 0) fen += `${emptyCount}`;
    if (i < 7) fen += "/";
  }

  fen += " ";
  fen += position.colorToMove === Color.White ? "w" : "b";

  fen += " ";
  if (position.whiteCanCastle.has("K")) fen += "K";
  if (position.whiteCanCastle.has("Q")) fen += "Q";
  if (position.blackCanCastle.has("k")) fen += "k";
  if (position.blackCanCastle.has("q")) fen += "q";

  fen += " ";
  if (position.enPassantOneStep == null) fen += "-";
  else fen += toAlg(position.enPassantOneStep);

  fen += ` ${position.halfMoveClock}`;

  fen += ` ${position.fullMoveNumber}`;

  return fen;
};
