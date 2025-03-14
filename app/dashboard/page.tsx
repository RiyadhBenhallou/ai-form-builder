import { Button } from "@/components/ui/button";

import EmptyState from "@/components/empty-state";
import { db } from "@/db";
import { forms } from "@/db/schema";
import { cn } from "@/lib/utils";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { LucidePersonStanding, PlusCircle } from "lucide-react";
import { unstable_noStore } from "next/cache";
import CreateFormDialog from "./_components/create-form-dialog";
import FormCard from "./_components/form-card";

export default async function Page() {
  unstable_noStore();
  const { userId } = await auth();
  if (!userId) throw new Error("User ID not found");
  const userForms = await db.query.forms.findMany({
    where: eq(forms.userId, userId),
  });
  // const response = await clerkClient.users.updateUserMetadata(userId, {
  //   privateMetadata: {
  //     credits: 8,
  //   },
  // })
  const user = await clerkClient().users.getUser(userId);
  const limit = user.unsafeMetadata.credits as number;
  return (
    <main className="bg-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black">Dashboard</h1>
        <CreateFormDialog>
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700"
            disabled={userForms.length >= limit}
          >
            <PlusCircle className={cn("h-5 w-5 mr-3")} />
            Create Form
          </Button>
        </CreateFormDialog>
      </div>
      {/* <FormsList forms={userForms} /> */}
      <div className="flex justify-center items-center">
        {userForms.length === 0 && (
          <EmptyState
            title="You have no forms yet!"
            icon={LucidePersonStanding}
            description="Try to create your first form now"
          />
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-8">
        {userForms.map((form) => {
          return <FormCard form={form} key={form.id} />;
        })}
      </div>
    </main>
  );
}
