import { Color, Piece } from "../../src/data/Piece";
import { initialPosition, Position } from "../../src/data/Position";
import { Square } from "../../src/data/Square";
import { bishopMoves } from "../../src/moves/bishopMoves";
import { getAlgFromMove, getMoveFromAlg, move } from "../../src/moves/move";

test("Vision after 1. e4.", () => {
  let position = initialPosition;
  let { newPosition } = move(getMoveFromAlg("e2e4"), position);
  let vision = bishopMoves(Square.F1, newPosition.board);
  expect(vision).toEqual([
    Square.E2,
    Square.D3,
    Square.C4,
    Square.B5,
    Square.A6,
  ]);
});
