import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class LiveGame extends BaseModel {
  @column({ isPrimary: true })
  public white_username: string;

  @column()
  public black_username: string;

  @column()
  public fen: string;

  @column()
  public computer_plays: number;

  @column()
  public white_time_left: number;

  @column()
  public black_time_left: number;

  @column()
  public time_of_last_move: number;

  @column()
  public status: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
