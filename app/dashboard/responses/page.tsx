import { db } from "@/db";
import { forms } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import ResponseCard from "./_components/response-card";
import EmptyState from "@/components/empty-state";
import { LucidePersonStanding } from "lucide-react";

export default async function ResponsesPage() {
  const { userId } = await auth();
  if (!userId) throw new Error("User not found");
  const userForms = await db.query.forms.findMany({
    where: eq(forms.userId, userId),
    with: {
      responses: true,
    },
  });
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between mb-8">
        <h1 className="text-2xl font-bold">Responses</h1>
      </div>
      <div className="flex justify-center items-center">
        {userForms.length === 0 && (
          <EmptyState
            title="You haven't created any form yet!"
            icon={LucidePersonStanding}
            description="Try to create your first form now and share it to gather responses"
          />
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {userForms.map(async (f) => {
          return <ResponseCard key={f.id} form={f} />;
        })}
      </div>
    </div>
  );
}
