import { db } from "@/db";
import { forms } from "@/db/schema";
import { eq } from "drizzle-orm";
import UserFormUI from "./_components/user-form-ui";
import { FormInput } from "lucide-react";
import Link from "next/link";

export default async function FormPreviewPage({
  params: { formId },
}: {
  params: { formId: string };
}) {
  const form = await db.query.forms.findFirst({
    where: eq(forms.id, formId),
  });
  if (!form) {
    return <div>Form not found</div>;
  }
  return (
    <div className="relative">
      <UserFormUI form={form} />
      <Link href={"/dashboard"} target="_blank">
        <div className="fixed bottom-5 left-5 text-white text-xs py-1 bg-gradient-to-tr from-black to-indigo-800 rounded-full border-2 border-blue-800">
          <div className="flex items-center gap-2 mx-4">
            <FormInput />
            Make your own AI form
          </div>
        </div>
      </Link>
    </div>
  );
}
