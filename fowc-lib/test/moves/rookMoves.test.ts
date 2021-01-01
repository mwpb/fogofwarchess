import { Color, Piece } from "../../src/data/Piece";
import { initialPosition, Position } from "../../src/data/Position";
import { Square } from "../../src/data/Square";
import { bishopMoves } from "../../src/moves/bishopMoves";
import { getAlgFromMove, getMoveFromAlg, move } from "../../src/moves/move";
import { rookMoves } from "../../src/moves/rookMoves";

test("Vision after 1. h4.", () => {
  let position = initialPosition;
  let { newPosition } = move(getMoveFromAlg("h2h4"), position);
  let vision = rookMoves(Square.H1, newPosition.board);
  expect(vision).toEqual([Square.H2, Square.H3]);
});
