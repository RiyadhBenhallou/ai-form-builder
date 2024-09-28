"use server";

import { db } from "@/db";
import { forms } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function getFormsWithResponses() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return await db.query.forms.findMany({
    where: eq(forms.userId, userId),
    with: {
      responses: true,
    },
  });
}
