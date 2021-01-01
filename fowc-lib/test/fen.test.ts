import { initialPosition, parseFen, toFen } from "../src/data/Position";
import { getMoveFromAlg, move } from "../src/moves/move";

test("Sicilian: 1. e4 c5 2. c5 Nf3", () => {
  let start = parseFen(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
  expect(start).toEqual(initialPosition);

  let whiteOne = move(getMoveFromAlg("e2e4"), start);
  expect(toFen(whiteOne.newPosition)).toEqual(
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
  );

  let blackOne = move(getMoveFromAlg("c7c5"), whiteOne.newPosition);
  expect(toFen(blackOne.newPosition)).toEqual(
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2"
  );

  let whiteTwo = move(getMoveFromAlg("g1f3"), blackOne.newPosition);
  expect(toFen(whiteTwo.newPosition)).toEqual(
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2"
  );
});

test("Incorrect: 1. e4 c5 2. e4", () => {
  let start = parseFen(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
  expect(start).toEqual(initialPosition);

  let whiteOne = move(getMoveFromAlg("e2e4"), start);
  expect(toFen(whiteOne.newPosition)).toEqual(
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
  );

  let blackOne = move(getMoveFromAlg("c7c5"), whiteOne.newPosition);
  expect(toFen(blackOne.newPosition)).toEqual(
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2"
  );

  let whiteTwo = move(getMoveFromAlg("e2e4"), blackOne.newPosition);
  expect(whiteTwo.message).toEqual("No piece to move.");
});
