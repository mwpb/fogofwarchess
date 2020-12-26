import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { log } from "App/Utils/logUtils";
import { schema } from "@ioc:Adonis/Core/Validator";
import LiveGame from "App/Models/LiveGame";
import {
  Color,
  initialPosition,
  toFen,
  move,
  parseFen,
  getMoveFromAlg,
  getStockfishMove,
  getHalfPosition,
} from "fowc-lib/dist";
import Ws from "App/Services/Ws";

export default class LiveGamesController {
  public async doPost(ctx: HttpContextContract) {
    log("Hit LiveGames", ctx);
    const validated = await ctx.request.validate({
      schema: schema.create({
        command: schema.string({ trim: true }),
      }),
    });
    let command = validated.command;

    // In future use username
    let sessionId = ctx.session.sessionId;

    if (command === "start_game") {
      // Choose colors
      let computerColor = Math.random() < 0.5 ? Color.White : Color.Black;
      let white_username = sessionId;
      let black_username = `stockfish${new Date().getTime()}`;
      if (computerColor === Color.White) {
        black_username = sessionId;
        white_username = `stockfish${new Date().getTime()}`;
      }

      let [existingGame, color] = await this.getExistingGame(sessionId);
      if (existingGame) {
        log(`${color} already playing game.`, ctx);
        ctx.response.status(403).send({});
        return;
      }

      try {
        log(computerColor.toString(), ctx);
        let liveGame = await LiveGame.create({
          white_username: white_username,
          black_username: black_username,
          fen: toFen(initialPosition),
          computer_plays: computerColor,
        });

        this.notifyParticipants(liveGame);
        log(`START GAME: ${white_username} vs ${black_username}`, ctx);
        ctx.response.status(200).send({});
        return;
      } catch (err) {
        console.log(err);

        log("White already playing game.", ctx);
        ctx.response.status(403).send({});
        return;
      }
    } else if (command === "get_game") {
      let [existingGame, color] = await this.getExistingGame(sessionId);
      if (existingGame) {
        let position = parseFen(existingGame.fen);
        let halfPosition = getHalfPosition(position, color);
        log(`GET GAME: ${sessionId}`, ctx);
        ctx.response.status(200).send(halfPosition);
        return;
      }

      log(`${sessionId} is not playing a game`, ctx);
      ctx.response.status(404).send({});
      return;
    } else if (command === "move") {
      const validated = await ctx.request.validate({
        schema: schema.create({
          move: schema.string({ trim: true }),
        }),
      });
      let moveString = validated.move;

      let [existingGame, color] = await this.getExistingGame(sessionId);
      if (!existingGame) {
        log(`${sessionId} is not playing a game`, ctx);
        ctx.response.status(404).send({});
        return;
      }

      let position = parseFen(existingGame.fen);
      if (position.colorToMove !== color) {
        log(`It is not your turn ${sessionId}`, ctx);
        ctx.response.status(403).send({});
        return;
      }

      let moveObj = getMoveFromAlg(moveString);
      let moveResult = move(moveObj, position);
      let newFen = toFen(moveResult.newPosition);
      existingGame.fen = newFen;
      await existingGame.save();

      this.notifyParticipants(existingGame);

      log(`Played move ${moveString}`, ctx);
      ctx.response.status(200).send({
        fen: newFen,
        message: moveResult.message,
      });
      return;
    } else if (command === "resign") {
      let [existingGame, color] = await this.getExistingGame(sessionId);
      if (existingGame) await existingGame.delete();

      log(`${sessionId} resigns game`, ctx);
      ctx.response.status(200).send({});
      return;
    }

    log("Command not found.", ctx);
    ctx.response.status(404).send({});
    return;
  }

  async getExistingGame(username: string): Promise<[LiveGame | null, Color]> {
    // Check if black has existing game
    let existing_black_game = await LiveGame.findBy("black_username", username);
    if (existing_black_game) {
      return [existing_black_game, Color.Black];
    }

    // Check if white has existing game
    let existing_white_game = await LiveGame.findBy("white_username", username);
    return [existing_white_game, Color.White];
  }

  notifyParticipants(liveGame: LiveGame) {
    let position = parseFen(liveGame.fen);
    let computerPlays = liveGame.computer_plays;
    if (computerPlays === position.colorToMove) {
      this.stockfishPlayMove(liveGame.white_username).catch(console.log);
    }
    Ws.io.to(liveGame.white_username).emit("update");
    Ws.io.to(liveGame.black_username).emit("update");
  }

  stockfishPlayMove = async (white_username: string) => {
    let liveGame = await LiveGame.findBy("white_username", white_username);

    if (!liveGame) {
      console.log("Stockfish cannot find game.");

      return;
    }
    let position = parseFen(liveGame.fen);
    let moveObj = await getStockfishMove(position);

    let moveResult = move(moveObj, position);
    let newFen = toFen(moveResult.newPosition);
    liveGame.fen = newFen;
    await liveGame.save();

    this.notifyParticipants(liveGame);
  };
}
