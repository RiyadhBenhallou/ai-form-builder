import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const forms = pgTable("form", {
  id: uuid("id").primaryKey().defaultRandom(),
  prompt: text("prompt").notNull(),
  jsonForm: text("json_form").notNull(),
  theme: text("theme").default("light").notNull(),
  backgroundColor: text("background_color"),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  auth: boolean("auth").default(false),
});

export const responses = pgTable("response", {
  id: uuid("id").primaryKey().defaultRandom(),
  jsonResponse: text("json_response").notNull(),
  userId: text("user_id").notNull(),
  formId: uuid("form_id")
    .notNull()
    .references(() => forms.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const formsRelations = relations(forms, ({ many }) => ({
  responses: many(responses),
}));

export const responsesRelations = relations(responses, ({ one }) => ({
  form: one(forms, {
    fields: [responses.formId],
    references: [forms.id],
  }),
}));

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
export type ResponseType = typeof responses.$inferSelect;
