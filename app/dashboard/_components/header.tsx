"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { SignOutButton, UserButton, useSession } from "@clerk/nextjs";
import {
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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <nav className="bg-background shadow-sm" suppressHydrationWarning>
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
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
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
                disabled={(progress ?? 5) >= 5}
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
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="mx-4 flex items-center justify-between">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <UserButton />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium">
                    {session?.user?.fullName}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {session?.user?.emailAddresses[0].emailAddress}
                  </div>
                </div>
              </div>
              <Button>
                <SignOutButton>Sign Out</SignOutButton>
              </Button>
            </div>

            <div className={cn("flex justify-center container mx-auto")}>
              <div className="w-1/2 mt-4">
                <Progress
                  value={((progress ?? 0) / 5) * 100}
                  color="#2563eb"
                  max={3}
                  className="w-full text-blue-600"
                />
                <div className="flex justify-center text-sm text-gray-600 mb-1">
                  {progress == null ? (
                    <span>Loading...</span>
                  ) : (
                    <>
                      <span className="font-bold">{progress}</span>/5 forms
                      created
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

// function NavLink({
//   href,
//   children,
// }: {
//   href: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <Link
//       href={href}
//       className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
//     >
//       {children}
//     </Link>
//   );
// }

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
