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
import { Loader2 } from "lucide-react";
import { ReactNode, useState, useTransition } from "react";

export function DeletionAlert({
  children,
  action,
  formId,
}: {
  children: ReactNode;
  action: (formId: string) => Promise<void>;
  formId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        await action(formId);
        setIsOpen(false);
      } catch (error) {
        console.error("Error deleting form:", error);
        // Optionally, you can add error handling here
      }
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">{children}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white text-black">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your form
            and remove all associated data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              "Yes, Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
