"use client";

import { useState } from "react";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EditFieldProps {
  field: {
    name: string;
    label: string;
    placeholder?: string;
  };
  onUpdate: (
    name: string,
    updates: { label: string; placeholder: string }
  ) => void;
}

export default function EditField({ field, onUpdate }: EditFieldProps) {
  const [label, setLabel] = useState(field.label);
  const [placeholder, setPlaceholder] = useState(field.placeholder || "");
  const [isOpen, setIsOpen] = useState(false);

  const handleUpdate = () => {
    onUpdate(field.name, { label, placeholder });
    console.log("Updating field:", field.name, { label, placeholder });
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Edit className="h-4 w-4" />
          {/* <span className="sr-only">Edit {field.label}</span> */}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Edit Field</h4>
            <p className="text-sm text-muted-foreground">
              Make changes to the field label and placeholder.
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`${field.name}-label`}>Label</Label>
            <Input
              id={`${field.name}-label`}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Enter field label"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`${field.name}-placeholder`}>Placeholder</Label>
            <Input
              id={`${field.name}-placeholder`}
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
              placeholder="Enter field placeholder"
            />
          </div>
          <Button onClick={handleUpdate}>Update Field</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
