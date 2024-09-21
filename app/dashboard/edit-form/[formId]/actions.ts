"use server";

import { db } from "@/db";
import { forms } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getForm(formId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const form = await db.query.forms.findFirst({
    where: and(eq(forms.id, formId), eq(forms.userId, userId)),
  });
  return form;
}

export async function updateForm(formId: string, jsonForm: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const form = await db
    .update(forms)
    .set({
      jsonForm,
    })
    .where(and(eq(forms.id, formId), eq(forms.userId, userId)))
    .returning();
  console.log(form);
  revalidatePath(`/dashboard/edit-form/${formId}`);
  return form;
}
