"use client";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function PricingGrid() {
  const { user } = useUser();
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-start-2">
          <Card className="w-full max-w-sm mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Pro Plan</CardTitle>
              <CardDescription>
                Perfect for professionals and small teams
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-4">
                $20<span className="text-lg font-normal">/month</span>
              </div>
              <ul className="space-y-2">
                {[
                  "Unlimited AI-generated forms",
                  "Advanced form customization",
                  "Data export and analytics",
                  "Priority customer support",
                  "Integrations with popular tools",
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link
                  href={`https://buy.stripe.com/test_cN27vV1Y86QK8Ug3cc?prefilled_email=${user?.primaryEmailAddress}`}
                  target="_blank"
                >
                  Get Started
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
