"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { chatSession } from "@/lib/ai-model";
import { cn, prompt } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useContext, useState, useTransition } from "react";
import { createForm } from "../actions";
import { ProgressContext } from "../progress-provider";

interface CustomDialogProps {
  children: React.ReactNode;
}

export default function CreateFormDialog({ children }: CustomDialogProps) {
  const [formType, setFormType] = useState("ai-generated");
  const [description, setDescription] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formSubheading, setFormSubheading] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, startTransition] = useTransition();
  const { setProgress } = useContext(ProgressContext)!;

  const handleSubmit = async () => {
    startTransition(async () => {
      if (formType === "ai-generated") {
        const fullPrompt = prompt(description);
        const result = await chatSession.sendMessage(fullPrompt);
        const jsonForm = result.response.text();
        await createForm(jsonForm, description);
      } else {
        // Create a blank form with just title and subheading
        const blankForm = JSON.stringify({
          title: formTitle || "Sample Form",
          subheading: formSubheading || "Please fill out this form",
          fields: [],
        });
        await createForm(blankForm, "Blank form created manually");
      }

      // Reset form and close dialog
      setDescription("");
      setFormTitle("");
      setFormSubheading("");
      setProgress((prevProgress) => (prevProgress ?? 0) + 1);
      setOpen(false);
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        // Reset form state when dialog is closed
        if (!newOpen) {
          setDescription("");
          setFormTitle("");
          setFormSubheading("");
        }
      }}
    >
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white text-black">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Create Form
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="form-type">Form Type</Label>
            <RadioGroup
              id="form-type"
              value={formType}
              onValueChange={setFormType}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ai-generated" id="ai-generated" />
                <Label htmlFor="ai-generated">AI-Generated</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="blank" id="blank" />
                <Label htmlFor="blank">Blank Form</Label>
              </div>
            </RadioGroup>
          </div>

          {formType === "ai-generated" ? (
            <div className="space-y-2">
              <Label htmlFor="description">Form Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your form in detail (e.g., 'A contact form with name, email, and message fields')"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[120px]"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="form-title">Form Title</Label>
                <Input
                  id="form-title"
                  placeholder="Sample Form"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="form-subheading">Form Subheading</Label>
                <Input
                  id="form-subheading"
                  placeholder="Please fill out this form"
                  value={formSubheading}
                  onChange={(e) => setFormSubheading(e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <p className="text-sm text-gray-500 italic">
                You can add form fields after creation
              </p>
            </div>
          )}
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
              "opacity-50 cursor-not-allowed":
                loading || (formType === "ai-generated" && !description.trim()),
            })}
            onClick={handleSubmit}
            disabled={
              loading || (formType === "ai-generated" && !description.trim())
            }
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
