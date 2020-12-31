import { Color, GameStatus } from "fowc-lib/dist";
import m from "mithril";
let statusDict = new Map<string, string>();
statusDict.set(GameStatus.InProgress, "Playing");
statusDict.set(GameStatus.WhiteWins, "White wins");
statusDict.set(GameStatus.BlackWins, "Black wins");
statusDict.set(GameStatus.WhiteResigns, "White resigns");
statusDict.set(GameStatus.BlackResigns, "Black resigns");

export let gameStatusDisplay = (
  game_status: string,
  is_requesting_human_game: boolean,
  colorToMove: Color
): m.Vnode => {
  if (game_status === GameStatus.InProgress) {
    if (colorToMove === Color.White) return m("div", "White to move");
    if (colorToMove === Color.Black) return m("div", "Black to move");
  }
  if (is_requesting_human_game) {
    return m("div", "Searching for game...")
  }
  if (!statusDict.get(game_status)) return m("");
  return m("div", statusDict.get(game_status));
};
