import { Button } from "@/components/ui/button";

import { db } from "@/db";
import { cn } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { PlusCircle } from "lucide-react";
import { unstable_noStore } from "next/cache";
import CreateFormDialog from "./_components/create-form-dialog";
import FormCard from "./_components/form-card";
import { forms } from "@/db/schema";

export default async function Page() {
  unstable_noStore();
  const { userId } = await auth();
  if (!userId) throw new Error("User ID not found");
  const userForms = await db.query.forms.findMany({
    where: eq(forms.userId, userId),
  });
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <CreateFormDialog>
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700"
            disabled={userForms.length >= 5}
          >
            <PlusCircle className={cn("h-5 w-5 mr-3")} />
            Create Form
          </Button>
        </CreateFormDialog>
      </div>
      {/* <FormsList forms={userForms} /> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-8">
        {userForms.map((form) => {
          return <FormCard form={form} key={form.id} />;
        })}
      </div>
    </>
  );
}
