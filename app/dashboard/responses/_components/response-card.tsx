"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormStructure, FormType, ResponseType } from "@/db/schema";
import { Download } from "lucide-react";
import { write, utils } from "xlsx"; // Install SheetJS: npm install xlsx

export default function ResponseCard({
  form,
  responses,
}: {
  form: FormType;
  responses: ResponseType[];
}) {
  const f = JSON.parse(form.jsonForm) as FormStructure;
  //   const handleExport = () => {
  //     const parsedResponses: any[] = [];
  //     responses.map((response) => {
  //       const parsedResponse = JSON.parse(response.jsonResponse);
  //       parsedResponses.push(parsedResponse);
  //     });
  //     console.log(parsedResponses);
  //   };

  const handleExport = () => {
    // Parse responses
    const parsedResponses = responses.map((response) =>
      JSON.parse(response.jsonResponse)
    );

    // Create a worksheet
    const ws = utils.json_to_sheet(parsedResponses);

    // Create a workbook
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Responses");

    // Generate XLSX file
    const excelBuffer = write(wb, { bookType: "xlsx", type: "array" });

    // Create a Blob from the buffer
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create a download link and trigger the download
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `"${f.title}" Form Responses.xlsx`;
    link.click();

    // Clean up
    URL.revokeObjectURL(url);
  };

  return (
    <Card key={form.id} className="flex flex-col justify-between relative">
      <CardHeader>
        <CardTitle className="text-lg">{f.title}</CardTitle>
        <CardDescription>{f.subheading}</CardDescription>
      </CardHeader>
      {/* <CardContent>
                <p>Card Content</p>
              </CardContent> */}
      <CardFooter className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-bold">{responses.length}</span> Responses
        </p>
        <Button
          variant={"outline"}
          className="bg-blue-600 hover:bg-blue-700 text-white hover:text-white"
          size={"sm"}
          onClick={handleExport}
          disabled={responses.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </CardFooter>
    </Card>
  );
}
