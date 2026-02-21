import React from "react";
import type { ReactNode } from "react";
import { TopNav } from "@/shared/layout/TopNav";
import { Sidebar } from "@/shared/layout/Sidebar";

interface DashboardLayoutProps {
    children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps): React.ReactNode {
    return (
        <div className="min-h-screen bg-[var(--color-surface-alt)]">
            <TopNav />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-8">
                    <div className="max-w-[var(--max-width)] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
