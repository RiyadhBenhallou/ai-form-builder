"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  ChevronLeft,
  FileText,
  MessageSquare,
  BarChart2,
  Zap,
  PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function SideNav() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Mock progress state (replace with actual state management in your app)
  const [progress, setProgress] = useState(2);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { name: "My Forms", href: "/forms", icon: FileText },
    { name: "Responses", href: "/responses", icon: MessageSquare },
    { name: "Analytics", href: "/analytics", icon: BarChart2 },
  ];

  return (
    <>
      {/* Mobile menu button */}
      {/* <Button
        variant="ghost"
        size="icon"
        className="fixed size-6 top-20 left-4 z-40 md:hidden"
        onClick={toggleMobileMenu}
      >
        <ChevronRight
          className={cn(
            "h-4 w-4 transition-transform",
            isMobileMenuOpen && "rotate-180"
          )}
        />
        <span className="sr-only">Toggle Menu</span>
      </Button> */}

      {/* Sidenav */}
      <div
        className={cn(
          "fixed md:sticky top-16 left-0 z-30 h-[calc(100vh-4rem)] bg-white shadow-md transition-all duration-200 ease-in-out overflow-y-auto",
          isCollapsed ? "w-20" : "w-64",
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col justify-between">
          <div className="flex flex-col space-y-2 p-4">
            {/* Collapse button - Styled like other nav items */}
            <button
              onClick={toggleCollapse}
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900",
                "focus:outline-none",
                !isCollapsed && "justify-center"
              )}
            >
              <ChevronLeft
                className={cn(
                  "h-5 w-5 flex-shrink-0 transition-transform",
                  isCollapsed && "rotate-180"
                )}
              />
              {/* {!isCollapsed && <span className="ml-3">Collapse Menu</span>} */}
            </button>
            {/* Create Form Button */}
            <Button
              className="w-full bg-blue-600 text-white hover:bg-blue-700 flex justify-start"
              asChild
            >
              <Link href="/create-form">
                <PlusCircle className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                {!isCollapsed && "Create Form"}
              </Link>
            </Button>

            {navItems.map((item) => (
              <NavItem
                key={item.name}
                href={item.href}
                icon={item.icon}
                isActive={pathname === item.href}
                isCollapsed={isCollapsed}
              >
                {item.name}
              </NavItem>
            ))}

            {/* Progress Bar */}
            {!isCollapsed && (
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{progress}/3 steps</span>
                </div>
                <Progress value={(progress / 3) * 100} className="w-full" />
              </div>
            )}
          </div>
          <div className="p-4">
            <Button
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              asChild
            >
              <Link href="/upgrade">
                <Zap className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                {!isCollapsed && "Upgrade"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function NavItem({
  href,
  icon: Icon,
  isActive,
  isCollapsed,
  children,
}: {
  href: string;
  icon: React.ElementType;
  isActive: boolean;
  isCollapsed: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900",
        isActive && "bg-gray-100 text-gray-900"
      )}
    >
      <Icon className={cn("h-5 w-5 flex-shrink-0", !isCollapsed && "mr-3")} />
      {!isCollapsed && <span>{children}</span>}
    </Link>
  );
}
