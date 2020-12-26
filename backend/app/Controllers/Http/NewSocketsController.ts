import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { log } from "App/Utils/logUtils";
import { schema } from "@ioc:Adonis/Core/Validator";
import Ws from "App/Services/Ws";

export default class NewSocketsController {
  public async doPost(ctx: HttpContextContract) {
    log("Hit NewSocket", ctx);
    const validated = await ctx.request.validate({
      schema: schema.create({
        socket_id: schema.string({ trim: true }),
      }),
    });
    let socket_id = validated.socket_id;
    let sessionId = ctx.session.sessionId;
    let socketSet = Ws.io.sockets.sockets;
    let socket = socketSet.get(socket_id);
    if (socket) {
      socket.join(sessionId);
      log(`CONNECT: ${sessionId} to ${socket_id}`, ctx);
      ctx.response.status(200).send({});
      return;
    } else {
      log("No socket found.", ctx);
      ctx.response.status(404).send({});
      return;
    }
  }
}
