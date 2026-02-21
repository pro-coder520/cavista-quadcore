import React from "react";
import type { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
}

export function Card({ children, className = "" }: CardProps): React.ReactNode {
    return (
        <div
            className={`bg-white rounded-xl border border-[var(--color-border)] p-6 ${className}`}
        >
            {children}
        </div>
    );
}
