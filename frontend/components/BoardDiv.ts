import { Color } from "fowc-lib/dist";
import m from "mithril";
import { black_username, position, white_username } from "../data/GameData";
import { BoardInput } from "./BoardInput";

export let BoardDiv: m.Component = {
  view: () =>
    m("div", [
      m("div", white_username),
      m("div", black_username),
      m(
        "div",
        position.colorToMove === Color.White ? "White to move" : "Black to move"
      ),
      m(BoardInput),
    ]),
};
