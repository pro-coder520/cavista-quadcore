import React from "react";
interface BadgeProps {
    label: string;
    variant?: "default" | "success" | "warning" | "error" | "info";
    className?: string;
}

const variantStyles: Record<string, string> = {
    default: "bg-gray-100 text-gray-700",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    error: "bg-red-50 text-red-700",
    info: "bg-sky-50 text-sky-700",
};

export function Badge({
    label,
    variant = "default",
    className = "",
}: BadgeProps): React.ReactNode {
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}
        >
            {label}
        </span>
    );
}
