import { db } from "@/db";
import { forms } from "@/db/schema";
import { eq } from "drizzle-orm";
import UserFormUI from "./_components/form";

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
    <div>
      <UserFormUI form={form} />
    </div>
  );
}
