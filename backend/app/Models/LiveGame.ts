import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class LiveGame extends BaseModel {
  @column({ isPrimary: true })
  public white_username: string;

  @column()
  public black_username: string;

  @column()
  public fen: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
