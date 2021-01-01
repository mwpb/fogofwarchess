import { Piece } from "./Piece";

export type Board = Piece[];

export let cloneBoard = (board: Board) => {
  return [...board];
};

// prettier-ignore
export let initialBoard: Piece[] = [
  "r", "n", "b", "q", "k", "b", "n", "r",
  "p", "p", "p", "p", "p", "p", "p", "p",
  " ", " ", " ", " ", " ", " ", " ", " ",
  " ", " ", " ", " ", " ", " ", " ", " ",
  " ", " ", " ", " ", " ", " ", " ", " ",
  " ", " ", " ", " ", " ", " ", " ", " ",
  "P", "P", "P", "P", "P", "P", "P", "P",
  "R", "N", "B", "Q", "K", "B", "N", "R"
] as Piece[];

export let parseBoard = (json: any): Board => {
  if (!Array.isArray(json)) return initialBoard;
  if (json.length !== 64) return initialBoard;
  for (let s of json) {
    if (typeof s !== "string") return initialBoard;
    if (!(s in Piece)) return initialBoard;
  }
  return json as Board;
};

export let boardFromFen = (fen: string): Board => {
  let board: Board = [];
  let fields = fen.split(" ");
  let ranks = fields[0].split("/");
  if (ranks.length !== 8) return initialBoard;
  for (let rank of ranks) {
    for (let square of rank) {
      if (["R", "N", "B", "Q", "K", "P", "?"].includes(square.toUpperCase())) {
        board.push(square as Piece);
      } else {
        try {
          let n = Number.parseInt(square);
          for (let i = 0; i < n; i++) {
            board.push(" " as Piece);
          }
        } catch (err) {
          return initialBoard;
        }
      }
    }
  }
  return board;
};
