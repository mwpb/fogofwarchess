import {
  coordinates,
  getColor,
  Piece,
  Square,
  getMoves,
  Color,
  ordinal,
} from "fowc-lib/dist";
import m from "mithril";
import { position, sendMove, user_color } from "../data/GameData";
import { piece2SVG } from "../images/chessPieces";

let squareInputs: m.Vnode[] = [];
for (let i = 0; i < 64; i++) {
  squareInputs.push(m("div", position.board[i]));
}

let highlightedSquares = new Set<Square>();
let selectedSquare: Square | null = null;

let selectSquare = (square: Square) => {
  if (!selectedSquare) {
    selectedSquare = square;
    let piece = position.board[square];
    if (getColor(piece) !== user_color) {
      highlightedSquares.clear();
      return;
    }

    let vision = getMoves(square, position);
    highlightedSquares.clear();
    for (let s of vision) highlightedSquares.add(s);
  } else {
    let legitMoves = getMoves(selectedSquare, position);
    if (legitMoves.includes(square)) {
      let selectedPiece = position.board[selectedSquare];
      let promotionPiece = Piece.Empty;
      let rank = coordinates(square)[0];
      if (selectedPiece === "P" && rank === 0) {
        promotionPiece = "Q" as Piece;
      }
      if (selectedPiece === "p" && rank === 7) {
        promotionPiece = "q" as Piece;
      }
      sendMove({
        fromSquare: selectedSquare,
        toSquare: square,
        promotionPiece: promotionPiece,
      });
    }
    selectedSquare = null;
    highlightedSquares.clear();
  }
};

let squareInput = (n: number): m.Vnode => {
  let [i, j] = coordinates(n);
  if (user_color === Color.Black) {
    i = 7 - i;
    j = 7 - j;
    n = ordinal(i, j);
  }
  let classes = [];

  if (highlightedSquares.has(n)) classes.push("highlight");
  if ((i + j) % 2) classes.push("dark_square");
  else classes.push("light_square");
  if (position.board[n] === "?") classes.push("fog_square");

  return m(
    "div",
    {
      class: classes.join(" "),
      onclick: () => {
        selectSquare(n);
      },
    },
    m.trust(piece2SVG[position.board[n]])
  );
};

export let BoardInput: m.Component = {
  view: () =>
    m(
      "div.grid.grid8x8",
      Array.from({ length: 64 }, (_x, n) => squareInput(n))
    ),
};
