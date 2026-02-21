import React from "react";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/types";
import { AuthLayout } from "@/shared/layout/AuthLayout";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";

const roles: { value: UserRole; label: string; description: string }[] = [
    { value: "PATIENT", label: "Patient", description: "Get AI-powered triage and trial matching" },
    { value: "CLINICIAN", label: "Clinician", description: "Access clinical decision support tools" },
    { value: "SPONSOR", label: "Sponsor", description: "Run decentralized clinical trials" },
];

export function RegisterPage(): React.ReactNode {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<UserRole>("PATIENT");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await register({
                email,
                password,
                first_name: firstName,
                last_name: lastName,
                role,
            });
            navigate("/dashboard");
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const axiosErr = err as { response?: { data?: { error?: string } } };
                setError(axiosErr.response?.data?.error || "Registration failed. Please try again.");
            } else {
                setError("Registration failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title="Create Account" subtitle="Join the equitable healthcare revolution">
            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {/* Role Selector */}
                <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                        I am a...
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {roles.map((r) => (
                            <button
                                key={r.value}
                                type="button"
                                onClick={() => setRole(r.value)}
                                className={`p-3 rounded-lg border text-center transition-all duration-200 cursor-pointer ${role === r.value
                                        ? "border-[var(--color-primary)] bg-blue-50 text-[var(--color-primary)]"
                                        : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-gray-300"
                                    }`}
                            >
                                <p className="text-sm font-medium">{r.label}</p>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Input
                        label="First Name"
                        type="text"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                    <Input
                        label="Last Name"
                        type="text"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>

                <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    label="Password"
                    type="password"
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                    Create Account
                </Button>

                <p className="text-center text-sm text-[var(--color-text-secondary)]">
                    Already have an account?{" "}
                    <Link to="/login" className="text-[var(--color-primary)] font-medium hover:underline">
                        Sign in
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
