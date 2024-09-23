import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormStructure, FormType } from "@/db/schema";
import { ArrowUpLeftFromSquare, Edit, Share2 } from "lucide-react";
import Link from "next/link";
import DeleteForm from "./delete-form";

export default function FormCard({ form }: { form: FormType }) {
  const f = JSON.parse(form.jsonForm) as FormStructure;

  return (
    <Card key={form.id} className="flex flex-col justify-between relative">
      <CardHeader>
        <CardTitle>{f.title}</CardTitle>
        <CardDescription>{f.subheading}</CardDescription>
      </CardHeader>
      {/* <CardContent>
                <p>Card Content</p>
              </CardContent> */}
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={"outline"}
            className="bg-white text-black group flex items-center gap-2"
            size={"sm"}
            // onClick={() => router.push(`/forms/${formId}`)}
            asChild
          >
            <Link href={`/forms/${form.id}`} target="_blank">
              <ArrowUpLeftFromSquare className="w-4 h-4" />
              Preview
            </Link>
          </Button>
          <Button
            variant={"outline"}
            className="bg-white text-black flex items-center gap-2"
            size={"sm"}
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
        <Button
          variant={"outline"}
          className="bg-blue-600 hover:bg-blue-700 text-white hover:text-white "
          size={"sm"}
          asChild
        >
          <Link
            href={`/dashboard/edit-form/${form.id}`}
            className="flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Link>
        </Button>
      </CardFooter>
      <DeleteForm formId={form.id} />
    </Card>
  );
}
