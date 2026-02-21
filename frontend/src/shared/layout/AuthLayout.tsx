import React from "react";
import type { ReactNode } from "react";
import { Logo } from "@/shared/ui/Logo";

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps): React.ReactNode {
    return (
        <div className="min-h-screen bg-[var(--color-surface-alt)] flex items-center justify-center p-4">
            <div className="w-full max-w-md animate-fade-in-up">
                <div className="flex justify-center mb-8">
                    <Logo size="lg" />
                </div>
                <div className="bg-white rounded-2xl border border-[var(--color-border)] p-8 shadow-sm">
                    <h1 className="text-2xl font-bold text-[var(--color-text)] text-center mb-1">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-sm text-[var(--color-text-secondary)] text-center mb-6">
                            {subtitle}
                        </p>
                    )}
                    {children}
                </div>
            </div>
        </div>
    );
}
