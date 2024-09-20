"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn, prompt } from "@/lib/utils";
import { chatSession } from "@/lib/ai-model";
import { Loader2 } from "lucide-react";
import { createForm } from "../actions";
import { useRouter } from "next/navigation";

// used prompt : based on description given below return in json format the following information: formTitle, formSubheading, formFields which is an array of name, label and placeholder objects\ndescription: [description]

interface CustomDialogProps {
  children: React.ReactNode;
  //   onSubmit: (description: string) => void;
}

export default function CreateFormDialog({
  children,
}: //   onSubmit,
CustomDialogProps) {
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async () => {
    startTransition(async () => {
      const fullPrompt = prompt(description);
      const result = await chatSession.sendMessage(fullPrompt);
      const jsonForm = result.response.text();
      const form = await createForm(jsonForm, fullPrompt);
      setDescription("");
      setOpen(false);
      router.push(`/dashboard/edit-form/${form.id}`);
    });
    // onSubmit(description);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white text-black">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Create Form
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Write description of your form"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="bg-white text-red-600 border-red-600 hover:bg-red-50"
          >
            Cancel
          </Button>
          <Button
            className={cn("bg-blue-600 hover:bg-blue-700 text-white", {
              "opacity-50 cursor-not-allowed": loading,
            })}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
