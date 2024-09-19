import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const test = pgTable("test", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
});
