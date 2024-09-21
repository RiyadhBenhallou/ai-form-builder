import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormStructure } from "@/db/schema";
import { cn } from "@/lib/utils";
import { useState } from "react";
import EditField from "./edit-field";
import { Loader2 } from "lucide-react";
import DeleteField from "./delete-field";

export default function FormUI({
  form,
  handleFieldUpdate,
  handleFieldDelete,
}: {
  form: FormStructure | undefined;
  handleFieldUpdate: (
    name: string,
    updates: { label: string; placeholder: string }
  ) => void;
  handleFieldDelete: (name: string) => void;
}) {
  const [formData, setFormData] = useState<Record<string, string | string[]>>(
    {}
  );

  if (!form) {
    return (
      <div className="w-full min-h-0 h-full flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const handleInputChange = (name: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here you would typically send the data to your backend
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-2">{form.title}</h1>
      <p className="text-gray-600 mb-6">{form.subheading}</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        {form.fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <Label
              htmlFor={field.name}
              className={cn(
                field.required &&
                  "after:content-['*'] after:ml-0.5 after:text-red-500"
              )}
            >
              {field.label}
            </Label>
            <div className="flex items-center justify-between space-x-2">
              {field.type === "text" && (
                <Input
                  type="text"
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  required={field.required}
                  onChange={(e) =>
                    handleInputChange(field.name, e.target.value)
                  }
                />
              )}
              {field.type === "textarea" && (
                <Textarea
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  required={field.required}
                  onChange={(e) =>
                    handleInputChange(field.name, e.target.value)
                  }
                />
              )}
              {field.type === "radio" && field.options && (
                <RadioGroup
                  onValueChange={(value) =>
                    handleInputChange(field.name, value)
                  }
                  required={field.required}
                >
                  {field.options.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={`${field.name}-${option.value}`}
                      />
                      <Label htmlFor={`${field.name}-${option.value}`}>
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              {field.type === "checkbox" && field.options && (
                <div className="space-y-2">
                  {field.options.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`${field.name}-${option.value}`}
                        onCheckedChange={(checked) => {
                          const currentValues =
                            (formData[field.name] as string[]) || [];
                          const newValues = checked
                            ? [...currentValues, option.value]
                            : currentValues.filter((v) => v !== option.value);
                          handleInputChange(field.name, newValues);
                        }}
                      />
                      <Label htmlFor={`${field.name}-${option.value}`}>
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
              {field.type === "select" && field.options && (
                <Select
                  onValueChange={(value) =>
                    handleInputChange(field.name, value)
                  }
                  required={field.required}
                >
                  <SelectTrigger className="w-full">
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
              <div className="flex items-center">
                <EditField field={field} onUpdate={handleFieldUpdate} />
                <DeleteField field={field} onDelete={handleFieldDelete} />
              </div>
            </div>
          </div>
        ))}
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </div>
  );
}
