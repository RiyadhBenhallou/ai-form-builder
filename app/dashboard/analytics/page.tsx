"use client";

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
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { getFormsWithResponses } from "./actions";

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

  return (
    <div className="container mx-auto p-4">
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
            <CardHeader>
              <CardTitle>Response Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {responses.map((response) => {
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
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
