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
import { Loader2 } from "lucide-react";
import { useState } from "react";
import DeleteField from "./delete-field";
import EditField from "./edit-field";

export default function FormUI({
  form,
  handleFieldUpdate,
  handleFieldDelete,
  theme,
  isLoading,
}: {
  form: FormStructure | undefined;
  handleFieldUpdate: (
    name: string,
    updates: { label: string; placeholder: string }
  ) => void;
  handleFieldDelete: (name: string) => void;
  theme: string | null | undefined;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState<Record<string, string | string[]>>(
    {}
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-black w-8 h-8" />
      </div>
    );
  }
  if (!form) return <div className="text-center p-4">No form found</div>;

  const handleInputChange = (name: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here you would typically send the data to your backend
  };

  return (
    <div
      className="w-full max-w-2xl mx-auto p-4 sm:p-6 rounded-lg shadow-md"
      data-theme={theme ?? "light"}
    >
      <h1 className="text-xl sm:text-2xl font-bold mb-2">{form.title}</h1>
      <p className="mb-6 text-sm sm:text-base">{form.subheading}</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        {form.fields?.map((field) => (
          <div key={field.name} className="space-y-2">
            <Label
              htmlFor={field.name}
              className={cn(
                "text-sm sm:text-base",
                field.required &&
                  "after:content-['*'] after:ml-0.5 after:text-red-500"
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
                    onChange={(e) =>
                      handleInputChange(field.name, e.target.value)
                    }
                    className="w-full"
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
                    className="w-full"
                  />
                )}
                {field.type === "radio" && field.options && (
                  <RadioGroup
                    onValueChange={(value) =>
                      handleInputChange(field.name, value)
                    }
                    required={field.required}
                    className="space-y-2"
                  >
                    {field.options.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={`${field.name}-${option.value}`}
                          className="radio-primary"
                        />
                        <Label
                          htmlFor={`${field.name}-${option.value}`}
                          className="text-sm"
                        >
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
                          className="checkbox-primary"
                          onCheckedChange={(checked) => {
                            const currentValues =
                              (formData[field.name] as string[]) || [];
                            const newValues = checked
                              ? [...currentValues, option.value]
                              : currentValues.filter((v) => v !== option.value);
                            handleInputChange(field.name, newValues);
                          }}
                        />
                        <Label
                          htmlFor={`${field.name}-${option.value}`}
                          className="text-sm"
                        >
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
              </div>
              <div className="flex items-center space-x-2 sm:w-1/4 justify-end">
                <EditField field={field} onUpdate={handleFieldUpdate} />
                <DeleteField field={field} onDelete={handleFieldDelete} />
              </div>
            </div>
          </div>
        ))}
        <button
          type="submit"
          className="w-full btn btn-primary text-sm sm:text-base py-2 px-4"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
