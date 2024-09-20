"use server";

import { db } from "@/db";
import { forms } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";

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
