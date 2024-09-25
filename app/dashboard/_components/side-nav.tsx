"use client";

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  MessageSquare,
  BarChart2,
  Zap,
  PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getUserForms } from "../actions";
import { ProgressContext } from "../progress-provider";

export default function SideNav() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const { progress, setProgress } = useContext(ProgressContext)!;

  useEffect(() => {
    async function fetchForms() {
      const forms = await getUserForms();
      setProgress(forms.length);
    }
    fetchForms();
  }, [setProgress]);

  // Mock progress state (replace with actual state management in your app)

  const navItems = [
    { name: "My Forms", href: "/dashboard", icon: FileText },
    { name: "Responses", href: "/dashboard/responses", icon: MessageSquare },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
  ];

  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isMounted) {
    return <div className="w-20 md:w-64" />; // Return a placeholder with the same width
  }

  return (
    <nav
      className={cn(
        "hidden md:block md:sticky top-16 left-0 z-30 h-[calc(100vh-4rem)] bg-white shadow-md transition-all duration-200 ease-in-out overflow-y-auto",
        isCollapsed ? "w-20 hover:w-64" : "w-64"
      )}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col space-y-2 p-4">
          <Button
            className="w-full bg-blue-600 text-white hover:bg-blue-700 flex justify-start"
            asChild
          >
            <Link href="/create-form">
              <PlusCircle className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
              <span className={cn(isCollapsed && "hidden")}>Create Form</span>
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

          <div className={cn("mb-4", isCollapsed && "hidden")}>
            <Progress
              value={((progress ?? 0) / 5) * 100}
              max={3}
              className="w-full"
            />
            <div className="flex justify-center text-sm text-gray-600 mb-1">
              {progress == null ? (
                <span>Loading...</span>
              ) : (
                <>
                  <span className="font-bold">{progress}</span>/5 forms created
                </>
              )}
            </div>
          </div>
        </div>
        <div className="p-4">
          <Button
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
            asChild
          >
            <Link href="/upgrade">
              <Zap className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
              <span className={cn(isCollapsed && "hidden")}>Upgrade</span>
            </Link>
          </Button>
        </div>
      </div>
    </nav>
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
      <span className={cn(isCollapsed && "hidden")}>{children}</span>
    </Link>
  );
}
