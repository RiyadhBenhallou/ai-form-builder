"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-react";
import { useTransition } from "react";
import { deleteForm } from "../actions";

export default function DeleteForm({ formId }) {
  const [isLoading, startTransition] = useTransition();

  const handleDeletion = async () => {
    startTransition(async () => {
      await deleteForm(formId);
    });
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="submit"
          variant={"ghost"}
          className="text-white absolute top-2 right-2 size-8"
          size={"icon"}
        >
          <Trash className="w-4 h-4 text-red-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white text-black">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeletion}
            className="bg-red-500 hover:bg-red-600"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="animate-spin text-white" />}
            Yes, Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
