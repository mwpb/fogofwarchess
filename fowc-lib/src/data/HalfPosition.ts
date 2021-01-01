import { Color } from "..";
import { getHalfBoard } from "./HalfBoard";
import { getColor } from "./Piece";
import { Position } from "./Position";
import { coordinates, nudge } from "./Square";

export let getHalfPosition = (position: Position, myColor: Color): Position => {
  let halfBoard = getHalfBoard(position.board, myColor);

  let enPassantOneStep = null;
  let enPassantTwoStep = null;

  if (position.enPassantOneStep && position.enPassantTwoStep) {
    let squareLeft = nudge(position.enPassantTwoStep, 0, -1);
    if (squareLeft) {
      let pieceLeft = position.board[squareLeft];
      if (pieceLeft.toUpperCase() === "P" && getColor(pieceLeft) !== myColor) {
        enPassantOneStep = position.enPassantOneStep;
        enPassantTwoStep = position.enPassantTwoStep;
      }
    }

    let squareRight = nudge(position.enPassantTwoStep, 0, 1);
    if (squareRight) {
      let pieceRight = position.board[squareRight];
      if (
        pieceRight.toUpperCase() === "P" &&
        getColor(pieceRight) !== myColor
      ) {
        enPassantOneStep = position.enPassantOneStep;
        enPassantTwoStep = position.enPassantTwoStep;
      }
    }
  }
  return {
    board: halfBoard,
    colorToMove: position.colorToMove,
    whiteCanCastle:
      myColor === Color.White ? position.whiteCanCastle : new Set(),
    blackCanCastle:
      myColor === Color.Black ? position.blackCanCastle : new Set(),
    enPassantOneStep: enPassantOneStep,
    enPassantTwoStep: enPassantTwoStep,
    halfMoveClock: -1,
    fullMoveNumber: position.fullMoveNumber,
  };
};
