import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class GameRequests extends BaseSchema {
  protected tableName = "game_requests";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string("username").primary();
      table.timestamps(true, true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
