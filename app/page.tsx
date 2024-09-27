"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@clerk/nextjs";
import { BarChart, FormInput, Menu, Sparkles, X, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LandingPage() {
  const { session, isLoaded } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="container mx-auto px-4 py-4 sm:py-8">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FormInput className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            <span className="text-xl sm:text-2xl font-bold text-gray-800">
              FormBildr
            </span>
          </div>
          <div className="hidden md:flex space-x-4">
            <Button variant="ghost">Features</Button>
            <Button variant="ghost">Pricing</Button>
            <Button variant="ghost">Contact</Button>
            {!isLoaded ? (
              <Button variant="outline" className="bg-gray-200 animated-pulse">
                <span className="text-gray-200">Get Started</span>
              </Button>
            ) : !session ? (
              <>
                <Button variant="outline">
                  <Link href="/sign-in">Log in</Link>
                </Button>
                <Button>
                  <Link href="/sign-up">Sign up</Link>
                </Button>
              </>
            ) : (
              <Button>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            )}
          </div>
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </nav>
        {mobileMenuOpen && (
          <div className="mt-4 flex flex-col space-y-2">
            <Button variant="ghost">Features</Button>
            <Button variant="ghost">Pricing</Button>
            <Button variant="ghost">Contact</Button>
            {!isLoaded ? (
              <Button variant="outline" className="bg-gray-200 animated-pulse">
                <span className="text-gray-200">Get Started</span>
              </Button>
            ) : !session ? (
              <>
                <Button variant="outline" asChild>
                  <Link href="/sign-in">Log in</Link>
                </Button>
                <Button asChild>
                  <Link href="/sign-up">Sign up</Link>
                </Button>
              </>
            ) : (
              <Button>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            )}
          </div>
        )}
      </header>

      <main className="container mx-auto px-4 py-8 sm:py-16">
        <section className="text-center mb-8 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Build Intelligent Forms with AI
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
            FormBildr uses advanced AI to help you create, manage, and analyze
            forms effortlessly. Boost your productivity and gain valuable
            insights.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            {isLoaded ? (
              <Button size="lg" className="text-lg">
                {!session ? (
                  <Link href="/sign-up">Get Started for Free</Link>
                ) : (
                  <Link href="/dashboard">Try it out</Link>
                )}
              </Button>
            ) : (
              <Button size="lg" className="bg-gray-200 animate-pulse">
                <span className="text-gray-200">Get Started for Free</span>
              </Button>
            )}
            <Button size="lg" variant="outline" className="text-lg">
              Watch Demo
            </Button>
          </div>
        </section>

        <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-16">
          <FeatureCard
            icon={<Zap className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-500" />}
            title="AI-Powered Forms"
            description="Create smart forms that adapt to user inputs and provide real-time suggestions."
          />
          <FeatureCard
            icon={
              <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-purple-500" />
            }
            title="Intuitive Builder"
            description="Drag-and-drop interface makes form creation a breeze, even for complex scenarios."
          />
          <FeatureCard
            icon={
              <BarChart className="w-10 h-10 sm:w-12 sm:h-12 text-green-500" />
            }
            title="Advanced Analytics"
            description="Gain valuable insights from form submissions with our powerful analytics tools."
          />
        </section>

        <section className="bg-white rounded-lg shadow-xl p-6 sm:p-8 mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
            Join thousands of satisfied users
          </h2>
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-blue-600">
                100k+
              </p>
              <p className="text-gray-600">Forms Created</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-blue-600">
                5M+
              </p>
              <p className="text-gray-600">Submissions</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-blue-600">
                98%
              </p>
              <p className="text-gray-600">Customer Satisfaction</p>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
            Ready to get started?
          </h2>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="max-w-xs w-full"
            />
            <Button size="lg" className="w-full sm:w-auto">
              Sign Up Now
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 mt-8 sm:mt-16 py-6 sm:py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2023 FormBildr. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center">
      <div className="flex justify-center mb-3 sm:mb-4">{icon}</div>
      <h3 className="text-lg sm:text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm sm:text-base text-gray-600">{description}</p>
    </div>
  );
}
