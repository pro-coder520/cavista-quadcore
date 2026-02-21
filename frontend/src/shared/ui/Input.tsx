import React from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export function Input({
    label,
    error,
    className = "",
    id,
    ...props
}: InputProps): React.ReactNode {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-[var(--color-text)] mb-1.5"
                >
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`w-full px-4 py-2.5 rounded-lg border bg-white text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent ${error
                        ? "border-[var(--color-error)] focus:ring-[var(--color-error)]"
                        : "border-[var(--color-border)]"
                    } ${className}`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-[var(--color-error)]">{error}</p>
            )}
        </div>
    );
}
