"use server";

import { db } from "@/db";
import { responses } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";

export async function saveResponse(
  formData: Record<string, string | string[]>,
  formId: string
) {
  let { userId } = await auth();
  if (!userId) {
    userId = "anonymous";
  }
  await db.insert(responses).values({
    formId,
    userId,
    jsonResponse: JSON.stringify(formData),
  });
}
