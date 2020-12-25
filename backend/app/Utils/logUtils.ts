import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export let log = (message:string, ctx: HttpContextContract) => {
  let ip = ctx.request.ip();

  let local = new Date();
  let utc = local.toISOString();

  let route = ctx.request.url();

  console.log(`${utc} ${ip} [${route}] ${message}`);
}