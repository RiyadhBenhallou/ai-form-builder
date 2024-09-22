import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const forms = pgTable("form", {
  id: uuid("id").primaryKey().defaultRandom(),
  prompt: text("prompt").notNull(),
  jsonForm: text("json_form").notNull(),
  theme: text("theme").default("light").notNull(),
  backgroundColor: text("background_color"),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type FormField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "radio" | "checkbox" | "select";
  placeholder?: string;
  required: boolean;
  options?: Array<{
    label: string;
    value: string;
  }>;
};

export type FormStructure = {
  title: string;
  subheading: string;
  fields: FormField[];
};

export type FormType = typeof forms.$inferSelect;
