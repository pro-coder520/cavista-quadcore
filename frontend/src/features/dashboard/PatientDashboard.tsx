import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";

export function PatientDashboard(): React.ReactNode {
    const { user } = useAuth();

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-[var(--color-text)]">
                    Welcome back, {user?.firstName}
                </h1>
                <p className="text-[var(--color-text-secondary)] mt-1">
                    Your health dashboard — manage your records, consents, and trial eligibility.
                </p>
            </div>

            {/* AI Triage CTA */}
            <div className="p-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold mb-1">🩺 AI-Powered Triage</h2>
                        <p className="text-blue-100 text-sm">
                            Describe your symptoms or upload a medical image for instant, private AI analysis — works offline.
                        </p>
                    </div>
                    <Link to="/dashboard/patient/triage">
                        <Button variant="secondary" size="lg">
                            Start Assessment
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card>
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">📋</span>
                        <h3 className="font-semibold text-[var(--color-text)]">Medical Records</h3>
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                        No records uploaded yet. Start your first AI triage session to begin.
                    </p>
                </Card>

                <Card>
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">✅</span>
                        <h3 className="font-semibold text-[var(--color-text)]">Active Consents</h3>
                    </div>
                    <p className="text-3xl font-bold text-[var(--color-text)]">0</p>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">consent records</p>
                </Card>

                <Card>
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">🔬</span>
                        <h3 className="font-semibold text-[var(--color-text)]">Trial Matches</h3>
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                        Complete your profile to be matched with eligible clinical trials.
                    </p>
                </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="md:col-span-1">
                    <h3 className="font-semibold text-[var(--color-text)] border-b border-[var(--color-border)] pb-3 mb-4">
                        Recent Activity
                    </h3>
                    <p className="text-sm text-[var(--color-text-muted)] text-center py-8">
                        No activity yet. Start a triage session to see your history here.
                    </p>
                </Card>

                <Card className="md:col-span-1">
                    <h3 className="font-semibold text-[var(--color-text)] border-b border-[var(--color-border)] pb-3 mb-4">
                        Upcoming Actions
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
                            <span>📝</span>
                            <span className="text-sm text-[var(--color-text)]">Complete your medical profile</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50">
                            <span>🔒</span>
                            <span className="text-sm text-[var(--color-text)]">Grant HIPAA consent to enable AI triage</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
