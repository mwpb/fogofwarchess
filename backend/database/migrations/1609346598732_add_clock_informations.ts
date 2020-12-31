import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class LiveGames extends BaseSchema {
  protected tableName = "live_games";

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.bigInteger("white_time_left").unsigned().notNullable();
      table.bigInteger("black_time_left").unsigned().notNullable();
      table.bigInteger("time_of_last_move").unsigned().notNullable();
    });
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn("white_time_left");
      table.dropColumn("black_time_left");
      table.dropColumn("time_of_last_move");
    });
  }
}
