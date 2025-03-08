"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { SignOutButton, UserButton, useSession, useUser } from "@clerk/nextjs";
import {
  ChartBar,
  FileText,
  FormInput,
  Menu,
  MessageSquare,
  PlusCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { ProgressContext } from "../progress-provider";
import CreateFormDialog from "./create-form-dialog";

export default function Header() {
  const { session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const { progress } = useContext(ProgressContext)!;
  const [isMounted, setIsMounted] = useState(false);
  const [limit, setLimit] = useState<null | number>(null);
  const { user } = useUser();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const updateUser = async () => {
      // const userData = await user?.update({
      //   unsafeMetadata: {
      //     credits: 8,
      //   },
      // });
      // console.log(userData);
      setLimit((user?.unsafeMetadata?.credits as number) || 5);
    };
    updateUser();
  }, [user]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  if (!isMounted) {
    return (
      <div className="bg-white shadow-sm animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
            <div className="hidden md:block w-10 h-10 bg-gray-300 rounded-full"></div>
            <div className="md:hidden w-6 h-6 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <nav className="bg-white shadow-sm" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <FormInput className="h-8 w-8 text-blue-600" />
            </Link>
          </div>

          <div className="hidden md:block">
            <UserButton />
          </div>
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isOpen ? (
                <X className="h-6 w-6 text-black" />
              ) : (
                <Menu className="h-6 w-6 text-black" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden relative z-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <CreateFormDialog>
              <Button
                className="w-full bg-blue-600 text-white hover:bg-blue-700 flex justify-start"
                disabled={(progress ?? 5) >= limit!}
              >
                <PlusCircle className={cn("h-5 w-5 mr-3")} />
                Create Form
              </Button>
            </CreateFormDialog>
            <MobileNavLink
              href="/dashboard"
              icon={<FileText className="mr-3 h-5 w-5" />}
            >
              My Forms
            </MobileNavLink>
            <MobileNavLink
              href="/dashboard/responses"
              icon={<MessageSquare className="mr-3 h-5 w-5" />}
            >
              Responses
            </MobileNavLink>
            <MobileNavLink
              href="/dashboard/analytics"
              icon={<ChartBar className="mr-3 h-5 w-5" />}
            >
              Analytics
            </MobileNavLink>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center justify-between flex-wrap">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <UserButton />
                </div>
                <div className="ml-3">
                  <div className="text-base text-black font-medium">
                    {session?.user?.fullName}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {session?.user?.emailAddresses[0].emailAddress}
                  </div>
                </div>
              </div>
              <Button className="mr-4">
                <SignOutButton>Sign Out</SignOutButton>
              </Button>
            </div>

            <div className={cn("flex justify-center container mx-auto")}>
              <div className="w-1/2 mt-4">
                <Progress
                  value={((progress ?? 0) / limit!) * 100}
                  color="#2563eb"
                  max={3}
                  className="w-full text-blue-600"
                />
                <div className="flex justify-center text-sm text-gray-600 mb-1">
                  {progress == null ? (
                    <span>Loading...</span>
                  ) : (
                    <>
                      <span className="font-bold">{progress}</span>/{limit}{" "}
                      forms created
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function MobileNavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-muted-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
    >
      <div className="flex items-center">
        {icon}
        {children}
      </div>
    </Link>
  );
}
