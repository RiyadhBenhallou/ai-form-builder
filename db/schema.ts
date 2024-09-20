import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const forms = pgTable("form", {
  id: uuid("id").primaryKey().defaultRandom(),
  prompt: text("prompt").notNull(),
  jsonForm: text("json_form").notNull(),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
