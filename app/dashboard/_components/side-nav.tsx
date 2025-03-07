"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  ChartBar,
  FileText,
  MessageSquare,
  PlusCircle,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { getUserForms } from "../actions";
import { ProgressContext } from "../progress-provider";
import CreateFormDialog from "./create-form-dialog";
import { useUser } from "@clerk/nextjs";

export default function SideNav() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const { progress, setProgress } = useContext(ProgressContext)!;
  const [limit, setLimit] = useState<null | number>(null);
  const { user } = useUser();
  console.log(user);

  const [isHidden, setIsHidden] = useState(isCollapsed);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (!isCollapsed) {
      timeoutId = setTimeout(() => {
        setIsHidden(false);
      }, 200);
    } else {
      setIsHidden(true);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isCollapsed]);

  useEffect(() => {
    async function fetchForms() {
      const forms = await getUserForms();
      setProgress(forms.length);
    }
    fetchForms();
  }, [setProgress]);

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

  // Mock progress state (replace with actual state management in your app)

  const navItems = [
    { name: "My Forms", href: "/dashboard", icon: FileText },
    { name: "Responses", href: "/dashboard/responses", icon: MessageSquare },
    { name: "Analytics", href: "/dashboard/analytics", icon: ChartBar },
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
    return (
      <div className="hidden md:block w-14 bg-gray-200 min-h-screen animate-pulse" />
    ); // Return a placeholder with the same width
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
          <CreateFormDialog>
            <Button
              className="w-full bg-blue-600 text-white hover:bg-blue-700 flex justify-start"
              disabled={(progress ?? 5) >= limit!}
            >
              <PlusCircle className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
              <span className={cn(isCollapsed && "hidden")}>Create Form</span>
            </Button>
          </CreateFormDialog>
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

          <div
            className={cn(
              "mb-4 transition-opacity duration-200 ease-in-out",
              isHidden ? "opacity-0 invisible" : "opacity-100 visible"
            )}
          >
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
                  <span className="font-bold">{progress}</span>/{limit} forms
                  created
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
            <Link href="/dashboard/upgrade">
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
