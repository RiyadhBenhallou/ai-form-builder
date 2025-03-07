"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2 } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

interface FieldOptionsProps {
  options: { label: string; value: string }[];
  setOptions: Dispatch<SetStateAction<{ label: string; value: string }[]>>;
}

export default function FieldOptions({
  options,
  setOptions,
}: FieldOptionsProps) {
  const handleAddOption = () => {
    setOptions([
      ...options,
      {
        label: `Option ${options.length + 1}`,
        value: `option${options.length + 1}`,
      },
    ]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 1) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (
    index: number,
    field: "label" | "value",
    value: string
  ) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Field Options</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddOption}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-3 w-3" />
          Add Option
        </Button>
      </div>

      {options.map((option, index) => (
        <div key={index} className="grid grid-cols-12 gap-2 items-center">
          <div className="col-span-5">
            <Input
              value={option.label}
              onChange={(e) =>
                handleOptionChange(index, "label", e.target.value)
              }
              placeholder="Option Label"
            />
          </div>
          <div className="col-span-5">
            <Input
              value={option.value}
              onChange={(e) =>
                handleOptionChange(index, "value", e.target.value)
              }
              placeholder="Option Value"
            />
          </div>
          <div className="col-span-2 flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveOption(index)}
              disabled={options.length <= 1}
              className="h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove option</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
