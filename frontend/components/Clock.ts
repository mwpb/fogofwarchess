import m from "mithril";
export let clock = (time_left: number) => {
  let seconds = Math.floor(time_left / 1000);
  let minutes = Math.floor(seconds / 60);
  seconds = seconds - 60 * minutes;
  let s = `${seconds}`;
  if (seconds < 10) s = `0${s}`;
  return m("div.lightBackground.pad", `${minutes}:${s}`);
};