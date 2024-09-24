"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import {
  BarChart2,
  FileText,
  Home,
  LayoutDashboard,
  Menu,
  MessageSquare,
  PlusCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

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
              <Home className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-primary">
                AppName
              </span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/analytics">Analytics</NavLink>
              <NavLink href="/settings">Settings</NavLink>
              <NavLink href="/help">Help</NavLink>
            </div>
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
            <Button
              className="w-full bg-blue-600 text-white hover:bg-blue-700 flex justify-start"
              asChild
            >
              <Link href="/create-form">
                <PlusCircle className={cn("h-5 w-5 mr-3")} />
                Create Form
              </Link>
            </Button>
            <MobileNavLink
              href="/dashboard"
              icon={<LayoutDashboard className="mr-3 h-5 w-5" />}
            >
              Dashboard
            </MobileNavLink>
            <MobileNavLink
              href="/my-forms"
              icon={<FileText className="mr-3 h-5 w-5" />}
            >
              My Forms
            </MobileNavLink>
            <MobileNavLink
              href="/responses"
              icon={<MessageSquare className="mr-3 h-5 w-5" />}
            >
              Responses
            </MobileNavLink>
            <MobileNavLink
              href="/analytics"
              icon={<BarChart2 className="mr-3 h-5 w-5" />}
            >
              Analytics
            </MobileNavLink>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <UserButton />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium">John Doe</div>
                <div className="text-sm font-medium text-muted-foreground">
                  john@example.com
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
    >
      {children}
    </Link>
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
