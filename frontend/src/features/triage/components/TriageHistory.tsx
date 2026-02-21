import React, { useEffect, useState } from "react";
import { offlineStore } from "@/lib/ai/offlineStore";
import { Badge } from "@/shared/ui/Badge";

interface HistoryEntry {
    id: string;
    timestamp: number;
    symptoms: string;
    source: string;
    result: {
        severity: string;
        diagnosis: string;
        confidenceScore: number;
    } | null;
    synced: boolean;
}

export function TriageHistory(): React.ReactNode {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadHistory = async (): Promise<void> => {
            try {
                const sessions = await offlineStore.getHistory(20);
                setHistory(sessions as unknown as HistoryEntry[]);
            } catch {
                // IndexedDB may not be available
            } finally {
                setIsLoading(false);
            }
        };
        loadHistory();
    }, []);

    if (isLoading) {
        return (
            <div className="text-center py-8 text-sm text-[var(--color-text-muted)]">
                Loading history...
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="text-3xl mb-3">📊</div>
                <p className="text-sm text-[var(--color-text-muted)]">
                    No triage history yet. Start your first assessment above.
                </p>
            </div>
        );
    }

    const severityVariant: Record<string, "success" | "warning" | "error" | "info"> = {
        LOW: "success",
        MEDIUM: "warning",
        HIGH: "error",
        CRITICAL: "error",
    };

    return (
        <div className="space-y-3">
            {history.map((entry) => (
                <div
                    key={entry.id}
                    className="p-4 rounded-lg border border-[var(--color-border)] bg-white hover:border-gray-300 transition-colors"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                {entry.result && (
                                    <Badge
                                        label={entry.result.severity}
                                        variant={severityVariant[entry.result.severity] || "info"}
                                    />
                                )}
                                <span className="text-xs text-[var(--color-text-muted)]">
                                    {new Date(entry.timestamp).toLocaleDateString()} ·{" "}
                                    {new Date(entry.timestamp).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                                {!entry.synced && (
                                    <span className="text-xs text-orange-500">● Not synced</span>
                                )}
                            </div>
                            <p className="text-sm text-[var(--color-text)] truncate">
                                {entry.result?.diagnosis || entry.symptoms || "Processing..."}
                            </p>
                        </div>
                        {entry.result && (
                            <span className="text-sm font-medium text-[var(--color-text-muted)] ml-4">
                                {Math.round(entry.result.confidenceScore * 100)}%
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
