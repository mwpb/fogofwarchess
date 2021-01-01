import { Color, Piece } from "../../src/data/Piece";
import { initialPosition, Position } from "../../src/data/Position";
import { Square } from "../../src/data/Square";
import { move } from "../../src/moves/move";

test("Initial Nf3.", () => {
  let position = initialPosition;
  let { newPosition, message } = move({
    fromSquare: Square.G1,
    toSquare: Square.F3,
    promotionPiece: Piece.Empty,
  }, position);
  // prettier-ignore
  let expectedBoard: Piece[] = [
    "r", "n", "b", "q", "k", "b", "n", "r",
    "p", "p", "p", "p", "p", "p", "p", "p",
    " ", " ", " ", " ", " ", " ", " ", " ",
    " ", " ", " ", " ", " ", " ", " ", " ",
    " ", " ", " ", " ", " ", " ", " ", " ",
    " ", " ", " ", " ", " ", "N", " ", " ",
    "P", "P", "P", "P", "P", "P", "P", "P",
    "R", "N", "B", "Q", "K", "B", " ", "R"
  ] as Piece[];
  let expectedPosition: Position = {
    board: expectedBoard,
    colorToMove: Color.Black,
    whiteCanCastle: new Set(["K", "Q"]),
    blackCanCastle: new Set(["k", "q"]),
    enPassantOneStep: null,
    enPassantTwoStep: null,
    halfMoveClock: 1,
    fullMoveNumber: 1,
  };
  expect(newPosition).toEqual(expectedPosition);
});
