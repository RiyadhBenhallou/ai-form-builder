import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlusCircle } from "lucide-react";
import CreateFormDialog from "./_components/create-form-dialog";

export default function Page() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <CreateFormDialog>
          <Button className="bg-blue-600 text-white hover:bg-blue-700">
            <PlusCircle className={cn("h-5 w-5 mr-3")} />
            Create Form
          </Button>
        </CreateFormDialog>
      </div>
    </>
  );
}
