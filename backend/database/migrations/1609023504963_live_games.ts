import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class LiveGames extends BaseSchema {
  protected tableName = "live_games";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer("computerPlays");
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn("computerPlays");
    });
  }
}
