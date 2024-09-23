"use server";

import { db } from "@/db";
import { forms, responses } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createForm(jsonForm: string, prompt: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const form = await db
    .insert(forms)
    .values({
      jsonForm,
      userId,
      prompt,
    })
    .returning();
  return form[0];
}

export async function deleteForm(formId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  await db.delete(responses).where(eq(responses.formId, formId));
  await db
    .delete(forms)
    .where(and(eq(forms.id, formId), eq(forms.userId, userId)));
  revalidatePath("/dashboard");
}
