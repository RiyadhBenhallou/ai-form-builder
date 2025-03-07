"use server";

import { db } from "@/db";
import { forms, responses } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createForm(jsonForm: string, description: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const createdForms = await db
    .insert(forms)
    .values({
      jsonForm,
      userId,
      prompt: description,
    })
    .returning();
  if (!createdForms) {
    throw new Error("Failed to create form");
  }
  redirect(`/dashboard/edit-form/${createdForms[0].id}`);
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

export async function getUserForms() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  return await db.query.forms.findMany({
    where: eq(forms.userId, userId),
  });
}
