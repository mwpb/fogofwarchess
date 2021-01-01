"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logUtils_1 = global[Symbol.for('ioc.use')]("App/Utils/logUtils");
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Ws_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Services/Ws"));
class NewSocketsController {
    async doPost(ctx) {
        logUtils_1.log("Hit NewSocket", ctx);
        const validated = await ctx.request.validate({
            schema: Validator_1.schema.create({
                socket_id: Validator_1.schema.string({ trim: true }),
            }),
        });
        let socket_id = validated.socket_id;
        let sessionId = ctx.session.sessionId;
        let socketSet = Ws_1.default.io.sockets.sockets;
        let socket = socketSet.get(socket_id);
        if (socket) {
            socket.join(sessionId);
            logUtils_1.log(`CONNECT: ${sessionId} to ${socket_id}`, ctx);
            ctx.response.status(200).send({});
            return;
        }
        else {
            logUtils_1.log("No socket found.", ctx);
            ctx.response.status(404).send({});
            return;
        }
    }
}
exports.default = NewSocketsController;
//# sourceMappingURL=NewSocketsController.js.map