import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export function prompt(description: string) {
//   return `based on description given below return in json format the following information: formTitle, formSubheading, formFields which is an array of name, label and placeholder objects\ndescription: ${description}`;
// }

export function prompt(description: string) {
  return `Based on the description given below, return a JSON object with the following structure:
  {
    "title": string,
    "subheading": string,
    "fields": [
      {
        "name": string,
        "label": string,
        "type": "text" | "textarea" | "radio" | "checkbox" | "select",
        "placeholder": string (optional, applicable for text and textarea),
        "required": boolean,
        "options": [
          {
            "label": string,
            "value": string
          }
        ] (optional, applicable for radio, checkbox, and select types)
      }
    ]
  }

Please ensure that:
1. Each field has an appropriate type based on the context.
2. For radio, checkbox, or select fields, provide relevant options.
3. Indicate whether each field is required or optional.
4. Include placeholder text for text and textarea fields when appropriate.
5. The form title and subheading should be concise and reflect the purpose of the form.

Description: ${description}

Please generate a complete and valid JSON object based on this description, ensuring all necessary fields are included and formatted correctly.`;
}
