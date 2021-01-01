import { Board } from "./Board";
import { Color, getColor } from "./Piece";

// prettier-ignore
export enum Square {
  A8, B8, C8, D8, E8, F8, G8, H8,
  A7, B7, C7, D7, E7, F7, G7, H7,
  A6, B6, C6, D6, E6, F6, G6, H6,
  A5, B5, C5, D5, E5, F5, G5, H5,
  A4, B4, C4, D4, E4, F4, G4, H4,
  A3, B3, C3, D3, E3, F3, G3, H3,
  A2, B2, C2, D2, E2, F2, G2, H2,
  A1, B1, C1, D1, E1, F1, G1, H1,
}

/**
 * Adds a square to an array of squares.
 * Returns a boolean indicating whether the piece can see further.
 * @param n The square to add.
 * @param squares The array of squares to add n to.
 * @param color The piece color.
 * @param board The board the piece is in.
 */
export let addSquare = (
  n: number | null,
  squares: Square[],
  color: Color,
  board: Board,
  isPawnMove = false,
  isPawnCapture = false,
  enPassantOneStep: Square | null = null
): boolean => {
  if (n == null) return false;
  if (0 <= n && n < 64) {
    let piece = board[n];
    let newColor = getColor(piece);

    if (piece === "?") return false;
    if (newColor === color) return false;

    if (newColor === Color.NoColor) {
      if (!isPawnCapture) {
        squares.push(n as Square);
        return true;
      }
      if (n === enPassantOneStep && isPawnCapture) {
        squares.push(n as Square);
        return true;
      }
      if (isPawnCapture) return false;
    }

    // So newColor is the opponents color.
    if (!isPawnMove || isPawnCapture) {
      squares.push(n as Square);
      return false;
    }

    return false;
  }
  return false;
};

/**
 * Returns a square close to the given square.
 * Origin is at top left.
 * Vertically down is positive.
 * Horizontally right is positive.
 * @param square square to begin from
 * @param i how far to move vertically
 * @param j how far to move horizontally
 */
export let nudge = (square: Square, i: number, j: number): number | null => {
  let [i0, j0] = coordinates(square);
  let i1 = i0 + i;
  let j1 = j0 + j;
  if (i1 < 0 || i1 > 7 || j1 < 0 || j1 > 7) return null;
  return ordinal(i1, j1);
};

export let coordinates = (square: Square): [number, number] => {
  return [Math.trunc(square / 8), square % 8];
};

export let ordinal = (i: number, j: number): number => 8 * i + j;

export let toAlg = (square: Square): string => {
  let [i, j] = coordinates(square);
  let file = String.fromCharCode("a".charCodeAt(0) + j);
  let rank = 8 - i;
  return `${file}${rank}`;
};

export let fromAlg = (alg: string): Square => {
  try {
    let i = 8 - Number.parseInt(alg.charAt(1));
    let j = alg.charCodeAt(0) - "a".charCodeAt(0);
    return ordinal(i, j);
  } catch (err) {
    return -1;
  }
};
