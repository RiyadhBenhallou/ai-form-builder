import { db } from "@/db";
import { forms, responses } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import ResponseCard from "./_components/response-card";

export default async function ResponsesPage() {
  const { userId } = await auth();
  if (!userId) throw new Error("User not found");
  const userFroms = await db.query.forms.findMany({
    where: eq(forms.userId, userId),
  });
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between mb-8">
        <h1 className="text-2xl font-bold">Responses</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {userFroms.map(async (f) => {
          const formResponses = await db.query.responses.findMany({
            where: eq(responses.formId, f.id),
          });
          return <ResponseCard key={f.id} form={f} responses={formResponses} />;
        })}
      </div>
    </div>
  );
}
