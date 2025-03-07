"use client"

import { Button } from "@/components/ui/button"
import type { FormField, FormType } from "@/db/schema"
import { cn } from "@/lib/utils"
import { ArrowLeft, ArrowUpLeftFromSquare, Share2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState, useTransition } from "react"
import FormUI from "./_components/form-ui"
import StylesController from "./_components/styles-controller"
import { getForm, updateBackground, updateForm, updateTheme } from "./actions"
import Link from "next/link"
import WebShare from "../../_components/web-share"
import AddField from "./_components/add-field"

export default function EditFormPage({
  params: { formId },
}: {
  params: { formId: string }
}) {
  const router = useRouter()
  const [form, setForm] = useState<FormType | undefined>()
  const [isLoading, startTransition] = useTransition()
  const isFirstRender = useRef(true)
  const [theme, setTheme] = useState<string | null>()
  const [backgroundColor, setBackgroundColor] = useState<string | null>()

  useEffect(() => {
    startTransition(async () => {
      const fetchedForm = await getForm(formId)
      if (fetchedForm) {
        setForm(fetchedForm)
        setTheme(fetchedForm.theme)
        setBackgroundColor(fetchedForm.backgroundColor ?? "bg-white")
      }
    })
  }, [formId])

  useEffect(() => {
    const updateFormInDatabase = async (updatedForm: FormType) => {
      try {
        await updateForm(formId, updatedForm)
        console.log("Form updated in database")
      } catch (error) {
        console.error("Error updating form in database:", error)
      }
    }
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (!form) return
    updateFormInDatabase(form)
  }, [form, formId])

  const handleFieldUpdate = async (name: string, updates: Partial<FormField>) => {
    setForm((prevForm) => {
      if (!prevForm) return prevForm
      const parsedJsonForm = JSON.parse(prevForm.jsonForm)
      const updatedJsonForm = {
        ...parsedJsonForm,
        fields: parsedJsonForm.fields.map((field: FormField) =>
          field.name === name ? { ...field, ...updates } : field,
        ),
      }
      return {
        ...prevForm,
        jsonForm: JSON.stringify(updatedJsonForm),
      }
    })
  }

  const handleFieldDelete = (name: string) => {
    setForm((prevForm) => {
      if (!prevForm) return prevForm
      const parsedJsonForm = JSON.parse(prevForm.jsonForm)
      const updatedJsonForm = {
        ...parsedJsonForm,
        fields: parsedJsonForm.fields.filter((f: FormField) => name !== f.name),
      }
      return {
        ...prevForm,
        jsonForm: JSON.stringify(updatedJsonForm),
      }
    })
  }

  const handleAddField = (newField: FormField) => {
    setForm((prevForm) => {
      if (!prevForm) return prevForm
      const parsedJsonForm = JSON.parse(prevForm.jsonForm)
      const updatedJsonForm = {
        ...parsedJsonForm,
        fields: [...parsedJsonForm.fields, newField],
      }
      return {
        ...prevForm,
        jsonForm: JSON.stringify(updatedJsonForm),
      }
    })
  }

  const handleReorderFields = (reorderedFields: FormField[]) => {
    setForm((prevForm) => {
      if (!prevForm) return prevForm
      const parsedJsonForm = JSON.parse(prevForm.jsonForm)
      const updatedJsonForm = {
        ...parsedJsonForm,
        fields: reorderedFields,
      }
      return {
        ...prevForm,
        jsonForm: JSON.stringify(updatedJsonForm),
      }
    })
  }

  const handleFormMetadataUpdate = (updates: { title?: string; subheading?: string }) => {
    setForm((prevForm) => {
      if (!prevForm) return prevForm
      const parsedJsonForm = JSON.parse(prevForm.jsonForm)
      const updatedJsonForm = {
        ...parsedJsonForm,
        ...updates,
      }
      return {
        ...prevForm,
        jsonForm: JSON.stringify(updatedJsonForm),
      }
    })
  }

  const jsonForm = form?.jsonForm ? JSON.parse(form.jsonForm) : null

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 group"
          size={"sm"}
          onClick={() => router.back()}
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-all" /> Back
        </Button>
        <div className="flex items-center gap-2">
          <Button variant={"outline"} className="bg-white text-black group flex items-center gap-2" size={"sm"} asChild>
            <Link href={`/forms/${formId}`} target="_blank">
              <ArrowUpLeftFromSquare className="w-4 h-4" />
              Preview
            </Link>
          </Button>
          <WebShare text={jsonForm?.subheading} title={jsonForm?.title} url={`/forms/${form?.id}`}>
            <Button variant={"outline"} className="bg-white text-black flex items-center gap-2" size={"sm"}>
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </WebShare>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 bg-white p-4 rounded-md shadow-md">
          {form && (
            <>
              <StylesController
                selectTheme={async (value) => {
                  setTheme(value)
                  await updateTheme(formId, value)
                }}
                changeBackground={async (value) => {
                  setBackgroundColor(value)
                  await updateBackground(formId, value)
                }}
                form={form}
              />
              <div className="mt-6 bg-card p-4 rounded-md shadow-sm">
                <h3 className="text-lg font-medium mb-4 text-foreground">Add New Field</h3>
                <AddField onAddField={handleAddField} />
              </div>
            </>
          )}
        </div>
        <div
          className={cn(
            "col-span-2 bg-white py-4 px-4 md:py-10 md:px-20 rounded-md shadow-md min-h-[80vh]",
            backgroundColor,
          )}
        >
          {form && (
            <FormUI
              form={JSON.parse(form.jsonForm)}
              isLoading={isLoading}
              handleFieldUpdate={handleFieldUpdate}
              handleFieldDelete={handleFieldDelete}
              handleReorderFields={handleReorderFields}
              handleFormMetadataUpdate={handleFormMetadataUpdate}
              theme={theme}
            />
          )}
        </div>
      </div>
    </div>
  )
}

