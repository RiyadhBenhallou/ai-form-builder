"use client";

import { useEffect, useState } from "react";
import { getForm } from "./actions";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import FormUI from "./_components/form-ui";
import { FormStructure } from "@/db/schema";

export default function EditFormPage({
  params: { formId },
}: {
  params: { formId: string };
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormStructure | undefined>();
  useEffect(() => {
    const fetchForm = async () => {
      const form = await getForm(formId);
      console.log(form);
      if (form) {
        setForm(JSON.parse(form.jsonForm));
      }
    };
    fetchForm();
  }, [formId]);
  return (
    <div className="">
      <Button
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 mb-2 group"
        size={"sm"}
        onClick={() => router.back()}
      >
        <ArrowLeft className="group-hover:-translate-x-1 transition-all" /> Back
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 bg-white p-4 rounded-md shadow-md">
          <h1 className="">controller</h1>
        </div>
        <div className="col-span-2 bg-white p-4 rounded-md shadow-md min-h-[80vh]">
          <h1 className="">
            <FormUI form={form} />
          </h1>
        </div>
      </div>
    </div>
  );
}
