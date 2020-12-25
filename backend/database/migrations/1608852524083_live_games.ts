import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class LiveGames extends BaseSchema {
  protected tableName = "live_games";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string("white_username").primary();
      table.string("black_username").index().unique();
      table.string("fen");
      table.timestamps(true, true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
