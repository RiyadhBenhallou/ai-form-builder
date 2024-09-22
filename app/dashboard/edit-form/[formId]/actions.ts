"use server";

import { db } from "@/db";
import { forms, FormType } from "@/db/schema";
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

export async function updateForm(formId: string, newForm: FormType) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const form = await db
    .update(forms)
    .set({
      ...newForm,
    })
    .where(and(eq(forms.id, formId), eq(forms.userId, userId)))
    .returning();
  console.log(form);
  revalidatePath(`/dashboard/edit-form/${formId}`);
  return form;
}

export async function updateTheme(formId: string, newTheme: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const form = await db
    .update(forms)
    .set({
      theme: newTheme,
    })
    .where(and(eq(forms.id, formId), eq(forms.userId, userId)))
    .returning();

  revalidatePath(`/dashboard/edit-form/${formId}`);
  return form;
}

export async function updateBackground(formId: string, newBackground: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const form = await db
    .update(forms)
    .set({
      backgroundColor: newBackground,
    })
    .where(and(eq(forms.id, formId), eq(forms.userId, userId)))
    .returning();

  revalidatePath(`/dashboard/edit-form/${formId}`);
  return form;
}
