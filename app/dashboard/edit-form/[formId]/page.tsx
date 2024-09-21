"use client";

import { useEffect, useRef, useState } from "react";
import { getForm, updateForm } from "./actions";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import FormUI from "./_components/form-ui";
import { FormStructure } from "@/db/schema";
import StylesController from "./_components/styles-controller";

export default function EditFormPage({
  params: { formId },
}: {
  params: { formId: string };
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormStructure | undefined>();
  const isFirstRender = useRef(true);
  const [theme, setTheme] = useState("light");

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

  useEffect(() => {
    const updateFormInDatabase = async (updatedForm: FormStructure) => {
      try {
        await updateForm(formId, JSON.stringify(updatedForm));
        console.log("Form updated in database");
      } catch (error) {
        console.error("Error updating form in database:", error);
      }
    };
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!form) return;
    updateFormInDatabase(form!);
  }, [form, formId]);

  const handleFieldUpdate = async (
    name: string,
    updates: { label: string; placeholder: string }
  ) => {
    setForm((prevForm) => {
      if (!prevForm) return prevForm;
      const updatedForm = {
        ...prevForm,
        fields: prevForm.fields.map((field) =>
          field.name === name ? { ...field, ...updates } : field
        ),
      };
      // updateFormInDatabase(updatedForm);
      return updatedForm;
    });
  };

  const handleFieldDelete = (name: string) => {
    setForm((prevForm) => {
      if (!prevForm) return prevForm;
      const updatedForm = {
        ...prevForm,
        fields: prevForm.fields.filter((f) => name !== f.name),
      };
      // updateFormInDatabase(updatedForm);
      return updatedForm;
    });
  };

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
          <StylesController selectTheme={(value) => setTheme(value)} />
        </div>
        <div className="col-span-2 bg-white p-4 rounded-md shadow-md min-h-[80vh]">
          <h1 className="">
            <FormUI
              form={form}
              handleFieldUpdate={handleFieldUpdate}
              handleFieldDelete={handleFieldDelete}
              theme={theme}
            />
          </h1>
        </div>
      </div>
    </div>
  );
}
