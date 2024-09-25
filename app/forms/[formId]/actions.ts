"use server";

import { db } from "@/db";
import { responses } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function saveResponse(
  formData: Record<string, string | string[]>,
  formId: string
) {
  const user = await currentUser();
  await db.insert(responses).values({
    formId,
    userEmail: user?.emailAddresses[0]?.emailAddress ?? "anonymous",
    jsonResponse: JSON.stringify(formData),
  });
  revalidatePath("/dashboard/responses");
}
