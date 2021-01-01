export enum Piece {
  BlackRook = "r",
  BlackKnight = "n",
  BlackBishop = "b",
  BlackQueen = "q",
  BlackKing = "k",
  BlackPawn = "p",
  WhiteRook = "R",
  WhiteKnight = "N",
  WhiteBishop = "B",
  WhiteQueen = "Q",
  WhiteKing = "K",
  WhitePawn = "P",
  Empty = " ",
  Fog = "?",
}

export enum Color {
  White,
  Black,
  NoColor,
}

export let getColor = (piece: Piece): Color => {  
  if (piece === " " || piece === "?") return Color.NoColor;
  if (piece === piece.toUpperCase()) return Color.White;
  return Color.Black;
};
