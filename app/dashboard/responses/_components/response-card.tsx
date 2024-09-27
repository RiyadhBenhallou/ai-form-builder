"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormStructure, FormType, ResponseType } from "@/db/schema";
import { Download, Calendar } from "lucide-react";
import { write, utils } from "xlsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Form = FormType & { responses: ResponseType[] };

export default function ResponseCard({ form }: { form: Form }) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const f = JSON.parse(form.jsonForm) as FormStructure;

  const handleExport = () => {
    // Filter responses based on the selected date
    const filteredResponses = form?.responses?.filter((response) => {
      if (!startDate) return true; // If no date is selected, include all responses
      const responseDate = response.createdAt!;
      return responseDate >= startDate;
    });

    // Parse filtered responses
    const parsedResponses = filteredResponses.map((response) =>
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
    link.download = `"${f.title}" Form Responses${
      startDate ? ` (from ${startDate.toISOString().split("T")[0]})` : ""
    }.xlsx`;
    link.click();

    // Clean up
    URL.revokeObjectURL(url);
  };

  const filteredResponsesCount = form?.responses?.filter((response) => {
    if (!startDate) return true;
    const responseDate = response.createdAt!;
    return responseDate >= startDate;
  }).length;

  return (
    <Card key={form.id} className="flex flex-col justify-between relative">
      <CardHeader>
        <CardTitle className="text-lg">{f.title}</CardTitle>
        <CardDescription>{f.subheading}</CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col items-start space-y-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date)}
            placeholderText="Select start date"
            className="border rounded px-2 py-1 text-sm bg-white"
          />
        </div>
        <div className="flex items-center justify-between w-full">
          <p className="text-sm text-muted-foreground">
            <span className="font-bold">{filteredResponsesCount}</span>{" "}
            Responses
            {startDate
              ? ` (from ${startDate.toISOString().split("T")[0]})`
              : " In Total"}
          </p>
          <Button
            variant={"outline"}
            className="bg-blue-600 hover:bg-blue-700 text-white hover:text-white"
            size={"sm"}
            onClick={handleExport}
            disabled={filteredResponsesCount === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
