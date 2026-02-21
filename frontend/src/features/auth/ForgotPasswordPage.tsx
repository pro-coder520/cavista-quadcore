import React from "react";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "@/shared/layout/AuthLayout";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";

export function ForgotPasswordPage(): React.ReactNode {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        setIsLoading(true);
        // In a real implementation, this would call authService.forgotPassword(email)
        // For now, we simulate success
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsSubmitted(true);
        setIsLoading(false);
    };

    if (isSubmitted) {
        return (
            <AuthLayout title="Check Your Email" subtitle="We've sent a password reset link">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto">
                        <span className="text-2xl">✉️</span>
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                        If an account exists for <strong>{email}</strong>, you'll receive a
                        password reset link shortly.
                    </p>
                    <Link
                        to="/login"
                        className="inline-block text-sm text-[var(--color-primary)] font-medium hover:underline"
                    >
                        Back to Sign In
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout title="Reset Password" subtitle="Enter your email to receive a reset link">
            <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                    Send Reset Link
                </Button>

                <p className="text-center text-sm text-[var(--color-text-secondary)]">
                    Remember your password?{" "}
                    <Link to="/login" className="text-[var(--color-primary)] font-medium hover:underline">
                        Sign in
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
