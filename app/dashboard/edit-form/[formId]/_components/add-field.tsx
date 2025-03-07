"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FormField } from "@/db/schema";
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import FieldOptions from "./field-options";

interface AddFieldProps {
  onAddField: (field: FormField) => void;
}

export default function AddField({ onAddField }: AddFieldProps) {
  const [open, setOpen] = useState(false);
  const [fieldType, setFieldType] = useState<string>("text");
  const [fieldName, setFieldName] = useState<string>("");
  const [fieldLabel, setFieldLabel] = useState<string>("");
  const [fieldPlaceholder, setFieldPlaceholder] = useState<string>("");
  const [fieldRequired, setFieldRequired] = useState<boolean>(false);
  const [fieldOptions, setFieldOptions] = useState<
    { label: string; value: string }[]
  >([{ label: "Option 1", value: "option1" }]);

  const handleAddField = () => {
    // Generate a unique name if not provided
    const name = fieldName || `field_${Date.now()}`;

    const newField: FormField = {
      name,
      type: fieldType as FormField["type"],
      label: fieldLabel,
      placeholder: fieldPlaceholder,
      required: fieldRequired,
      options: ["select", "radio", "checkbox"].includes(fieldType)
        ? fieldOptions
        : undefined,
    };

    onAddField(newField);
    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setFieldType("text");
    setFieldName("");
    setFieldLabel("");
    setFieldPlaceholder("");
    setFieldRequired(false);
    setFieldOptions([{ label: "Option 1", value: "option1" }]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Field
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Add New Form Field</DialogTitle>
          <DialogDescription>
            Create a new field for your form. Configure all options below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fieldType" className="text-right">
              Type
            </Label>
            <Select value={fieldType} onValueChange={setFieldType}>
              <SelectTrigger id="fieldType" className="col-span-3">
                <SelectValue placeholder="Select field type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text Input</SelectItem>
                <SelectItem value="textarea">Text Area</SelectItem>
                <SelectItem value="select">Dropdown</SelectItem>
                <SelectItem value="radio">Radio Buttons</SelectItem>
                <SelectItem value="checkbox">Checkboxes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fieldName" className="text-right">
              Name
            </Label>
            <Input
              id="fieldName"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              placeholder="field_name"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fieldLabel" className="text-right">
              Label
            </Label>
            <Input
              id="fieldLabel"
              value={fieldLabel}
              onChange={(e) => setFieldLabel(e.target.value)}
              placeholder="Field Label"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fieldPlaceholder" className="text-right">
              Placeholder
            </Label>
            {fieldType === "textarea" ? (
              <Textarea
                id="fieldPlaceholder"
                value={fieldPlaceholder}
                onChange={(e) => setFieldPlaceholder(e.target.value)}
                placeholder="Enter placeholder text"
                className="col-span-3"
              />
            ) : (
              <Input
                id="fieldPlaceholder"
                value={fieldPlaceholder}
                onChange={(e) => setFieldPlaceholder(e.target.value)}
                placeholder="Enter placeholder text"
                className="col-span-3"
              />
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fieldRequired" className="text-right">
              Required
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Switch
                id="fieldRequired"
                checked={fieldRequired}
                onCheckedChange={setFieldRequired}
              />
              <Label htmlFor="fieldRequired">
                {fieldRequired ? "Yes" : "No"}
              </Label>
            </div>
          </div>

          {["select", "radio", "checkbox"].includes(fieldType) && (
            <FieldOptions options={fieldOptions} setOptions={setFieldOptions} />
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddField}>Add Field</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
