"use client";
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
import { FormType } from "@/db/schema";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React, { useState, useTransition } from "react";
import { saveResponse } from "../actions";
import { useUser } from "@clerk/nextjs";

interface UserFormUIProps {
  form: FormType;
}

export default function UserFormUI({ form }: UserFormUIProps) {
  const jsonSchema = JSON.parse(form?.jsonForm ?? "{}");
  const { user } = useUser();

  const [formData, setFormData] = useState<Record<string, string | string[]>>(
    {}
  );
  const [isLoading, startTransition] = useTransition();
  const { toast } = useToast();
  const [formKey, setFormKey] = useState(0);

  if (!form) return <div>No form found</div>;

  const handleInputChange = (name: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    startTransition(async () => {
      try {
        if (!user && form.auth) {
          toast({
            variant: "destructive",
            title: "Submission Failed!",
            description: "You should be authenticated to submit this form.",
          });
          return;
        }
        await saveResponse(formData, form.id);
        setFormData({});
        setFormKey((prevKey) => prevKey + 1); // Increment the key to force re-render
        toast({
          variant: "default",
          className: "bg-white",
          title: "Form submitted successfully",
          description: "Form creators will be notified of your response.",
        });
      } catch (e) {
        console.log(e);
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: "Please try again later.",
        });
      }
    });
  };

  return (
    <div
      className={cn(
        "flex justify-center items-center min-h-screen",
        form.backgroundColor
      )}
    >
      <div
        className="w-[400px] md:w-[650px] p-6 m-6 rounded-lg shadow-md"
        data-theme={form.theme ?? 'light'}
      >
        <h1 className="text-2xl font-bold mb-2">{jsonSchema.title}</h1>
        <p className="mb-6">{jsonSchema.subheading}</p>
        <form key={formKey} onSubmit={handleSubmit} className="space-y-6">
          {jsonSchema.fields?.map((field) => (
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
              <div>
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
                          className="radio-primary"
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
                          className="checkbox-primary"
                          onCheckedChange={(checked) => {
                            const currentValues =
                              (formData[field.name] as string[]) ?? [];
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
              </div>
            </div>
          ))}
          <button
            type="submit"
            className="w-full btn btn-primary"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
