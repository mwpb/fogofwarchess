"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
let log = (message, ctx) => {
    let ip = ctx.request.ip();
    let local = new Date();
    let utc = local.toISOString();
    let route = ctx.request.url();
    console.log(`${utc} ${ip} [${route}] ${message}`);
};
exports.log = log;
//# sourceMappingURL=logUtils.js.map