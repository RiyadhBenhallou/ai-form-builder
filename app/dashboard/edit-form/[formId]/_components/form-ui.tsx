"use client"

import type React from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { FormField, FormStructure } from "@/db/schema"
import { cn } from "@/lib/utils"
import { Loader2, MoveVertical, Pencil } from "lucide-react"
import { useState } from "react"
import DeleteField from "./delete-field"
import EditField from "./edit-field"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { Button } from "@/components/ui/button"

interface FormUIProps {
  form: FormStructure | undefined
  handleFieldUpdate: (name: string, updates: Partial<FormField>) => void
  handleFieldDelete: (name: string) => void
  handleReorderFields: (reorderedFields: FormField[]) => void
  handleFormMetadataUpdate: (updates: { title?: string; subheading?: string }) => void
  theme: string | null | undefined
  isLoading: boolean
}

// SortableField component remains the same
const SortableField = ({
  field,
  handleInputChange,
  formData,
  handleFieldUpdate,
  handleFieldDelete,
}: {
  field: FormField
  handleInputChange: (name: string, value: string | string[]) => void
  formData: Record<string, string | string[]>
  handleFieldUpdate: (name: string, updates: Partial<FormField>) => void
  handleFieldDelete: (name: string) => void
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.name })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="space-y-2 border border-gray-200 p-4 rounded-md relative bg-background"
    >
      <div className="absolute right-2 top-2 cursor-move" {...attributes} {...listeners}>
        <MoveVertical className="h-4 w-4 text-gray-400" />
      </div>

      <Label
        htmlFor={field.name}
        className={cn(
          "text-sm sm:text-base text-foreground",
          field.required && "after:content-['*'] after:ml-0.5 after:text-red-500",
        )}
      >
        {field.label}
      </Label>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="w-full sm:w-3/4">
          {field.type === "text" && (
            <Input
              type="text"
              id={field.name}
              name={field.name}
              placeholder={field.placeholder}
              required={field.required}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className="w-full text-foreground"
            />
          )}
          {field.type === "textarea" && (
            <Textarea
              id={field.name}
              name={field.name}
              placeholder={field.placeholder}
              required={field.required}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className="w-full text-foreground"
            />
          )}
          {field.type === "radio" && field.options && (
            <RadioGroup
              onValueChange={(value) => handleInputChange(field.name, value)}
              required={field.required}
              className="space-y-2"
            >
              {field.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${field.name}-${option.value}`} className="radio-primary" />
                  <Label htmlFor={`${field.name}-${option.value}`} className="text-sm text-foreground">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
          {field.type === "checkbox" && field.options && (
            <div className="space-y-2">
              {field.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.name}-${option.value}`}
                    className="checkbox-primary"
                    onCheckedChange={(checked) => {
                      const currentValues = (formData[field.name] as string[]) || []
                      const newValues = checked
                        ? [...currentValues, option.value]
                        : currentValues.filter((v) => v !== option.value)
                      handleInputChange(field.name, newValues)
                    }}
                  />
                  <Label htmlFor={`${field.name}-${option.value}`} className="text-sm text-foreground">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          )}
          {field.type === "select" && field.options && (
            <Select onValueChange={(value) => handleInputChange(field.name, value)} required={field.required}>
              <SelectTrigger className="w-full text-foreground">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="flex items-center space-x-2 sm:w-1/4 justify-end">
          <EditField field={field} onUpdate={handleFieldUpdate} />
          <DeleteField field={field} onDelete={handleFieldDelete} />
        </div>
      </div>
    </div>
  )
}

export default function FormUI({
  form,
  handleFieldUpdate,
  handleFieldDelete,
  handleReorderFields,
  handleFormMetadataUpdate,
  theme,
  isLoading,
}: FormUIProps) {
  const [formData, setFormData] = useState<Record<string, string | string[]>>({})
  const [editingTitle, setEditingTitle] = useState(false)
  const [editingSubheading, setEditingSubheading] = useState(false)
  const [title, setTitle] = useState(form?.title || "")
  const [subheading, setSubheading] = useState(form?.subheading || "")

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-black w-8 h-8" />
      </div>
    )
  }
  if (!form) return <div className="text-center p-4">No form found</div>

  const handleInputChange = (name: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Here you would typically send the data to your backend
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = form.fields.findIndex((field) => field.name === active.id)
      const newIndex = form.fields.findIndex((field) => field.name === over.id)

      const newFields = [...form.fields]
      const [movedItem] = newFields.splice(oldIndex, 1)
      newFields.splice(newIndex, 0, movedItem)

      handleReorderFields(newFields)
    }
  }

  const saveTitle = () => {
    handleFormMetadataUpdate({ title })
    setEditingTitle(false)
  }

  const saveSubheading = () => {
    handleFormMetadataUpdate({ subheading })
    setEditingSubheading(false)
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 rounded-lg shadow-md bg-white" data-theme={theme ?? "light"}>
      {/* Editable Title */}
      <div className="mb-2 group relative">
        {editingTitle ? (
          <div className="flex items-center gap-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl sm:text-2xl font-bold text-foreground"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") saveTitle()
              }}
            />
            <Button size="sm" onClick={saveTitle}>
              Save
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">{form.title}</h1>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
              onClick={() => {
                setTitle(form.title)
                setEditingTitle(true)
              }}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit title</span>
            </Button>
          </div>
        )}
      </div>

      {/* Editable Subheading */}
      <div className="mb-6 group relative">
        {editingSubheading ? (
          <div className="flex items-center gap-2">
            <Textarea
              value={subheading}
              onChange={(e) => setSubheading(e.target.value)}
              className="text-sm sm:text-base text-muted-foreground"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  saveSubheading()
                }
              }}
            />
            <Button size="sm" onClick={saveSubheading}>
              Save
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p className="text-sm sm:text-base text-muted-foreground">{form.subheading}</p>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
              onClick={() => {
                setSubheading(form.subheading)
                setEditingSubheading(true)
              }}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit description</span>
            </Button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext items={form.fields.map((field) => field.name)} strategy={verticalListSortingStrategy}>
            {form.fields?.map((field) => (
              <SortableField
                key={field.name}
                field={field}
                handleInputChange={handleInputChange}
                formData={formData}
                handleFieldUpdate={handleFieldUpdate}
                handleFieldDelete={handleFieldDelete}
              />
            ))}
          </SortableContext>
        </DndContext>
        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-md text-sm sm:text-base"
        >
          Submit
        </button>
      </form>
    </div>
  )
}

