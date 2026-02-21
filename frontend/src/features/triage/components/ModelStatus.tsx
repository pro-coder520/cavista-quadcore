import React from "react";
import type { ModelProgress, ModelStatus } from "@/lib/ai/modelManager";

interface ModelStatusProps {
    status: ModelStatus;
    progress: ModelProgress;
    isOffline: boolean;
    onLoadModel: () => void;
    onUnloadModel: () => void;
}

const statusConfig: Record<
    ModelStatus,
    { icon: string; text: string; color: string }
> = {
    idle: { icon: "⚪", text: "AI Model Not Loaded", color: "text-gray-500" },
    checking: { icon: "🔍", text: "Checking Device...", color: "text-blue-500" },
    downloading: { icon: "⬇️", text: "Downloading Model...", color: "text-blue-500" },
    loading: { icon: "⏳", text: "Loading Model...", color: "text-blue-500" },
    ready: { icon: "🟢", text: "AI Ready (On-Device)", color: "text-emerald-600" },
    error: { icon: "🔴", text: "Model Error", color: "text-red-500" },
    unsupported: { icon: "☁️", text: "Using Server Mode", color: "text-amber-500" },
};

export function ModelStatusComponent({
    status,
    progress,
    isOffline,
    onLoadModel,
    onUnloadModel,
}: ModelStatusProps): React.ReactNode {
    const config = statusConfig[status];

    return (
        <div className="p-4 rounded-xl border border-[var(--color-border)] bg-white">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-lg">{config.icon}</span>
                    <div>
                        <p className={`text-sm font-medium ${config.color}`}>
                            {config.text}
                        </p>
                        {progress.text && status !== "ready" && status !== "idle" && (
                            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                                {progress.text}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {isOffline && (
                        <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-700 font-medium">
                            Offline
                        </span>
                    )}

                    {status === "idle" && (
                        <button
                            onClick={onLoadModel}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors cursor-pointer"
                        >
                            Load AI Model
                        </button>
                    )}

                    {status === "ready" && (
                        <button
                            onClick={onUnloadModel}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            Unload
                        </button>
                    )}

                    {status === "unsupported" && (
                        <span className="text-xs text-[var(--color-text-muted)]">
                            Using backend fallback
                        </span>
                    )}
                </div>
            </div>

            {/* Progress bar */}
            {(status === "downloading" || status === "loading") && (
                <div className="mt-3">
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-300"
                            style={{ width: `${progress.progress * 100}%` }}
                        />
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1 text-right">
                        {Math.round(progress.progress * 100)}%
                    </p>
                </div>
            )}
        </div>
    );
}
