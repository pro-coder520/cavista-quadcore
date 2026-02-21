import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/shared/ui/Card";

export function ClinicianDashboard(): React.ReactNode {
    const { user } = useAuth();

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-[var(--color-text)]">
                    Welcome, Dr. {user?.lastName}
                </h1>
                <p className="text-[var(--color-text-secondary)] mt-1">
                    Clinical decision support — review triage results and manage patient care.
                </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
                <Card>
                    <p className="text-sm text-[var(--color-text-muted)] mb-1">Pending Triage</p>
                    <p className="text-3xl font-bold text-[var(--color-text)]">0</p>
                </Card>
                <Card>
                    <p className="text-sm text-[var(--color-text-muted)] mb-1">Patients Today</p>
                    <p className="text-3xl font-bold text-[var(--color-text)]">0</p>
                </Card>
                <Card>
                    <p className="text-sm text-[var(--color-text-muted)] mb-1">Active Trials</p>
                    <p className="text-3xl font-bold text-[var(--color-text)]">0</p>
                </Card>
                <Card>
                    <p className="text-sm text-[var(--color-text-muted)] mb-1">AI Confidence Avg</p>
                    <p className="text-3xl font-bold text-[var(--color-text)]">—</p>
                </Card>
            </div>

            <Card>
                <h3 className="font-semibold text-[var(--color-text)] border-b border-[var(--color-border)] pb-3 mb-4">
                    Triage Queue
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] text-center py-8">
                    No patients in the triage queue. Results will appear here as patients complete AI assessments.
                </p>
            </Card>
        </div>
    );
}
