import { Piece, Color } from "../../src/data/Piece";
import { initialPosition, Position } from "../../src/data/Position";
import { Square } from "../../src/data/Square";
import { getMoveFromAlg, move } from "../../src/moves/move";

test("1.d4 c5 2.d5 e5 3.dxe6.", () => {
  let position = initialPosition;
  let whiteOne = move(getMoveFromAlg("d2d4"), position);
  let blackOne = move(getMoveFromAlg("c7c5"), whiteOne.newPosition);
  let whiteTwo = move(getMoveFromAlg("d4d5"), blackOne.newPosition);
  let blackTwo = move(getMoveFromAlg("e7e5"), whiteTwo.newPosition);
  let whiteThree = move(getMoveFromAlg("d5e6"), blackTwo.newPosition);
  // prettier-ignore
  let expectedBoard: Piece[] = [
    "r", "n", "b", "q", "k", "b", "n", "r",
    "p", "p", " ", "p", " ", "p", "p", "p",
    " ", " ", " ", " ", "P", " ", " ", " ",
    " ", " ", "p", " ", " ", " ", " ", " ",
    " ", " ", " ", " ", " ", " ", " ", " ",
    " ", " ", " ", " ", " ", " ", " ", " ",
    "P", "P", "P", " ", "P", "P", "P", "P",
    "R", "N", "B", "Q", "K", "B", "N", "R"
  ] as Piece[];
  let expectedPosition: Position = {
    board: expectedBoard,
    colorToMove: Color.Black,
    whiteCanCastle: new Set(["K", "Q"]),
    blackCanCastle: new Set(["k", "q"]),
    enPassantOneStep: null,
    enPassantTwoStep: null,
    halfMoveClock: 0,
    fullMoveNumber: 3,
  };
  expect(whiteThree.newPosition).toEqual(expectedPosition);
});
