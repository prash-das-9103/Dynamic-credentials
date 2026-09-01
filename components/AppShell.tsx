"use client";

import { useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { TopHeader } from "./TopHeader";
import { SelectionTray } from "./SelectionTray";

interface AppShellProps {
  title: string;
  breadcrumb?: { label: string; href?: string }[];
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (v: string) => void;
  searchPlaceholder?: string;
  children: React.ReactNode;
}

export function AppShell({
  title,
  breadcrumb,
  showSearch,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  children,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopHeader
          title={title}
          breadcrumb={breadcrumb}
          onMenuClick={() => setSidebarOpen(true)}
          showSearch={showSearch}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          searchPlaceholder={searchPlaceholder}
        />
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
      <SelectionTray />
    </div>
  );
}
