"use client";

import { Button } from "@/components/ui/button";
import { FormField, FormType } from "@/db/schema";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import FormUI from "./_components/form-ui";
import StylesController from "./_components/styles-controller";
import { getForm, updateBackground, updateForm, updateTheme } from "./actions";

export default function EditFormPage({
  params: { formId },
}: {
  params: { formId: string };
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormType | undefined>();
  const isFirstRender = useRef(true);
  const [theme, setTheme] = useState<string | null>();
  const [backgroundColor, setBackgroundColor] = useState<string | null>();

  useEffect(() => {
    const fetchForm = async () => {
      const fetchedForm = await getForm(formId);
      console.log(fetchedForm);
      if (fetchedForm) {
        setForm(fetchedForm);
        setTheme(fetchedForm.theme);
        setBackgroundColor(fetchedForm.backgroundColor ?? "bg-white");
      }
    };
    fetchForm();
  }, [formId]);

  useEffect(() => {
    const updateFormInDatabase = async (updatedForm: FormType) => {
      try {
        await updateForm(formId, updatedForm);
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
    updateFormInDatabase(form);
  }, [form, formId]);

  const handleFieldUpdate = async (
    name: string,
    updates: { label: string; placeholder: string }
  ) => {
    setForm((prevForm) => {
      if (!prevForm) return prevForm;
      const parsedJsonForm = JSON.parse(prevForm.jsonForm);
      const updatedJsonForm = {
        ...parsedJsonForm,
        fields: parsedJsonForm.fields.map((field: FormField) =>
          field.name === name ? { ...field, ...updates } : field
        ),
      };
      return {
        ...prevForm,
        jsonForm: JSON.stringify(updatedJsonForm),
      };
    });
  };

  const handleFieldDelete = (name: string) => {
    setForm((prevForm) => {
      if (!prevForm) return prevForm;
      const parsedJsonForm = JSON.parse(prevForm.jsonForm);
      const updatedJsonForm = {
        ...parsedJsonForm,
        fields: parsedJsonForm.fields.filter((f: FormField) => name !== f.name),
      };
      return {
        ...prevForm,
        jsonForm: JSON.stringify(updatedJsonForm),
      };
    });
  };

  return (
    <div>
      <Button
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 mb-2 group"
        size={"sm"}
        onClick={() => router.back()}
      >
        <ArrowLeft className="group-hover:-translate-x-1 transition-all" /> Back
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 bg-white p-4 rounded-md shadow-md">
          <StylesController
            selectTheme={async (value) => {
              setTheme(value);
              await updateTheme(formId, value);
            }}
            changeBackground={async (value) => {
              setBackgroundColor(value);
              await updateBackground(formId, value);
            }}
          />
        </div>
        <div
          className={cn(
            "col-span-2 bg-white py-10 px-20 rounded-md shadow-md min-h-[80vh]",
            backgroundColor
          )}
        >
          <h1 className="">
            {form && (
              <FormUI
                form={JSON.parse(form.jsonForm)}
                handleFieldUpdate={handleFieldUpdate}
                handleFieldDelete={handleFieldDelete}
                theme={theme}
              />
            )}
          </h1>
        </div>
      </div>
    </div>
  );
}
