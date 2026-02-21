import React from "react";
import type { TriageResultData } from "@/lib/ai/inferenceEngine";
import { Card } from "@/shared/ui/Card";
import { Badge } from "@/shared/ui/Badge";

interface TriageResultsProps {
    result: TriageResultData;
}

const severityConfig: Record<
    string,
    { color: "success" | "warning" | "error" | "info"; label: string; bg: string }
> = {
    LOW: { color: "success", label: "Low Severity", bg: "bg-emerald-50 border-emerald-200" },
    MEDIUM: { color: "warning", label: "Medium Severity", bg: "bg-amber-50 border-amber-200" },
    HIGH: { color: "error", label: "High Severity", bg: "bg-orange-50 border-orange-200" },
    CRITICAL: { color: "error", label: "Critical", bg: "bg-red-50 border-red-200" },
};

export function TriageResults({ result }: TriageResultsProps): React.ReactNode {
    const defaultSeverity = { color: "warning" as const, label: "Medium Severity", bg: "bg-amber-50 border-amber-200" };
    const severityKey = result.severity || "MEDIUM";
    const severity = (severityKey in severityConfig) ? severityConfig[severityKey]! : defaultSeverity;

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Severity Banner */}
            <div className={`p-4 rounded-xl border ${severity.bg}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Badge label={severity.label} variant={severity.color} />
                        <span className="text-sm text-[var(--color-text-secondary)]">
                            {result.inferenceMode === "CLIENT"
                                ? "🔒 Analyzed on your device"
                                : "☁️ Analyzed on server"}
                        </span>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-[var(--color-text)]">
                            {Math.round(result.confidenceScore * 100)}%
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)]">Confidence</p>
                    </div>
                </div>
            </div>

            {/* Diagnosis */}
            <Card>
                <h3 className="font-semibold text-[var(--color-text)] mb-3">
                    📋 Assessment
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {result.diagnosis}
                </p>
            </Card>

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
                <Card>
                    <h3 className="font-semibold text-[var(--color-text)] mb-3">
                        💊 Recommendations
                    </h3>
                    <ul className="space-y-2">
                        {result.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <span className="text-[var(--color-primary)] mt-0.5 text-sm">•</span>
                                <span className="text-sm text-[var(--color-text-secondary)]">
                                    {rec}
                                </span>
                            </li>
                        ))}
                    </ul>
                </Card>
            )}

            {/* Differential Diagnoses */}
            {result.differentialDiagnoses.length > 0 && (
                <Card>
                    <h3 className="font-semibold text-[var(--color-text)] mb-3">
                        🔬 Differential Diagnoses
                    </h3>
                    <div className="space-y-3">
                        {result.differentialDiagnoses.map((dx, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <span className="text-sm text-[var(--color-text)]">
                                    {dx.condition}
                                </span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[var(--color-primary)] rounded-full transition-all"
                                            style={{ width: `${dx.confidence * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-[var(--color-text-muted)] w-10">
                                        {Math.round(dx.confidence * 100)}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Explainability */}
            {result.explainability &&
                Object.keys(result.explainability).length > 0 && (
                    <Card>
                        <h3 className="font-semibold text-[var(--color-text)] mb-3">
                            🧠 AI Explainability
                        </h3>
                        {(
                            result.explainability as {
                                contributing_factors?: string[];
                                reasoning?: string;
                            }
                        ).contributing_factors && (
                                <div className="mb-3">
                                    <p className="text-xs font-medium text-[var(--color-text-muted)] mb-2">
                                        Contributing Factors:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {(
                                            result.explainability as {
                                                contributing_factors: string[];
                                            }
                                        ).contributing_factors.map((factor, i) => (
                                            <span
                                                key={i}
                                                className="px-2 py-1 text-xs bg-gray-100 text-[var(--color-text-secondary)] rounded-md"
                                            >
                                                {factor}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        {(result.explainability as { reasoning?: string }).reasoning && (
                            <p className="text-sm text-[var(--color-text-secondary)]">
                                {(result.explainability as { reasoning: string }).reasoning}
                            </p>
                        )}
                    </Card>
                )}

            {/* Disclaimer */}
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                <p className="text-xs text-amber-800">
                    ⚠️ This AI assessment is <strong>not a medical diagnosis</strong>.
                    Always consult a qualified healthcare professional before making
                    medical decisions. If you are experiencing a medical emergency,
                    call your local emergency number immediately.
                </p>
            </div>
        </div>
    );
}
