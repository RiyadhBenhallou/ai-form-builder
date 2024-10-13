"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormStructure, FormType } from "@/db/schema";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { CalendarIcon, LucidePersonStanding, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getFormsWithResponses } from "./actions";
import EmptyState from "@/components/empty-state";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type ResponseType = {
  id: string;
  jsonResponse: string;
  userEmail: string;
  createdAt: Date;
};

type FormWithResponses = FormType & {
  responses: ResponseType[] | [];
};

export default function FormAnalytics() {
  const [forms, setForms] = useState<FormWithResponses[] | any>([]);
  const [selectedForm, setSelectedForm] = useState<string>("");
  const [parsedForms, setParsedForms] = useState<Record<string, FormStructure>>(
    {}
  );
  const [responses, setResponses] = useState<ResponseType[]>([]);
  const [responseOverTime, setResponseOverTime] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    async function fetchForms() {
      const formsWithResponses = await getFormsWithResponses();
      if (formsWithResponses && formsWithResponses.length > 0) {
        setForms(formsWithResponses);
        const parsed = formsWithResponses.reduce((acc, form) => {
          acc[form.id] = JSON.parse(form.jsonForm);
          return acc;
        }, {} as Record<string, FormStructure>);
        setParsedForms(parsed);
      }
    }
    fetchForms();
  }, []);

  useEffect(() => {
    if (selectedForm) {
      const selectedFormData = forms.find((form) => form.id === selectedForm);
      if (selectedFormData) {
        setResponses(selectedFormData.responses);

        // Calculate responses over time
        const responseDates = selectedFormData.responses.map(
          (response) => new Date(response.createdAt).toISOString().split("T")[0]
        );
        const responseCount = responseDates.reduce((acc, date) => {
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        setResponseOverTime(responseCount);
      }
    } else {
      setResponses([]);
      setResponseOverTime({});
    }
  }, [selectedForm, forms]);

  const chartData = {
    labels: Object.keys(responseOverTime),
    datasets: [
      {
        label: "Responses",
        data: Object.values(responseOverTime),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Responses Over Time",
      },
    },
  };

  const handleFormChange = (formId: string) => {
    setSelectedForm(formId);
  };

  const calculateAverageRating = () => {
    if (responses.length === 0) return "N/A";
    const sum = responses.reduce((acc, response) => {
      const parsedResponse = JSON.parse(response.jsonResponse);
      return acc + (parsedResponse.rating || 0);
    }, 0);
    return (sum / responses.length).toFixed(1);
  };

  // pagintaing logic
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const itemsPerPage = 5;

  const filteredResponses = selectedDate
    ? responses.filter(
        (response) =>
          response.createdAt.toDateString() === selectedDate.toDateString()
      )
    : responses;

  const totalPages = Math.ceil(filteredResponses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResponses = filteredResponses.slice(startIndex, endIndex);

  const clearDateFilter = () => {
    setSelectedDate(null);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto p-4 text-black">
      <h1 className="text-2xl font-bold mb-4">Form Analytics</h1>

      <Select onValueChange={handleFormChange} value={selectedForm}>
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Select a form" />
        </SelectTrigger>
        <SelectContent>
          {/* {forms.length === 0 && (
            <SelectItem key="none" value="">
              No forms found
            </SelectItem>
          )} */}
          {forms.length > 0 &&
            forms.map((form) => (
              <SelectItem key={form.id} value={form.id}>
                {parsedForms[form.id]?.title || "Untitled Form"}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      {selectedForm && (
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{responses.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{calculateAverageRating()}</p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Responses Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <Line options={chartOptions} data={chartData} />
            </CardContent>
          </Card>

          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="mr-4">Response Breakdown</CardTitle>
              <div className="relative">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date: any) => {
                    setSelectedDate(date);
                    setCurrentPage(1);
                  }}
                  customInput={
                    <Button
                      variant="outline"
                      className="w-[240px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate
                        ? selectedDate.toLocaleDateString()
                        : "Pick a date"}
                    </Button>
                  }
                />
                {selectedDate && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={clearDateFilter}
                    aria-label="Clear date filter"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {currentResponses.length === 0 && (
                <EmptyState
                  description=""
                  title="Nothing is here..."
                  icon={LucidePersonStanding}
                />
              )}
              <ul className="space-y-2">
                {currentResponses.map((response) => {
                  const parsedResponse = JSON.parse(response.jsonResponse);
                  return (
                    <li key={response.id} className="bg-muted p-2 rounded">
                      <p>
                        <strong>Date:</strong>{" "}
                        {response.createdAt.toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Email:</strong> {response.userEmail}
                      </p>
                      {Object.entries(parsedResponse).map(([key, value]) => (
                        <p key={key}>
                          <strong>{key}:</strong> {value as string}
                        </p>
                      ))}
                    </li>
                  );
                })}
              </ul>
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <Button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
