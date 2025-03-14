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
import type { FormField } from "@/db/schema";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FieldOptions from "./field-options";

interface EditFieldProps {
  field: FormField;
  onUpdate: (name: string, updates: Partial<FormField>) => void;
}

export default function EditField({ field, onUpdate }: EditFieldProps) {
  const [open, setOpen] = useState(false);
  const [fieldType, setFieldType] = useState<string>(field.type);
  const [fieldLabel, setFieldLabel] = useState<string>(field.label);
  const [fieldPlaceholder, setFieldPlaceholder] = useState<string>(
    field.placeholder || ""
  );
  const [fieldRequired, setFieldRequired] = useState<boolean>(
    field.required || false
  );
  const [fieldOptions, setFieldOptions] = useState<
    { label: string; value: string }[]
  >(field.options || [{ label: "Option 1", value: "option1" }]);

  const handleUpdateField = () => {
    const updates: Partial<FormField> = {
      type: fieldType as FormField["type"],
      label: fieldLabel,
      placeholder: fieldPlaceholder,
      required: fieldRequired,
    };

    if (["select", "radio", "checkbox"].includes(fieldType)) {
      updates.options = fieldOptions;
    }

    onUpdate(field.name, updates);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit field</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Edit Field</DialogTitle>
          <DialogDescription>
            Make changes to the field properties.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="editFieldType" className="text-right">
              Type
            </Label>
            <Select value={fieldType} onValueChange={setFieldType}>
              <SelectTrigger id="editFieldType" className="col-span-3">
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
            <Label htmlFor="editFieldLabel" className="text-right">
              Label
            </Label>
            <Input
              id="editFieldLabel"
              value={fieldLabel}
              onChange={(e) => setFieldLabel(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="editFieldPlaceholder" className="text-right">
              Placeholder
            </Label>
            {fieldType === "textarea" ? (
              <Textarea
                id="editFieldPlaceholder"
                value={fieldPlaceholder}
                onChange={(e) => setFieldPlaceholder(e.target.value)}
                className="col-span-3"
              />
            ) : (
              <Input
                id="editFieldPlaceholder"
                value={fieldPlaceholder}
                onChange={(e) => setFieldPlaceholder(e.target.value)}
                className="col-span-3"
              />
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="editFieldRequired" className="text-right">
              Required
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Switch
                id="editFieldRequired"
                checked={fieldRequired}
                onCheckedChange={setFieldRequired}
              />
              <Label htmlFor="editFieldRequired">
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
          <Button onClick={handleUpdateField}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
