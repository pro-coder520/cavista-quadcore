/**
 * useAIEngine Hook
 *
 * React hook exposing AI model status, loading, and inference.
 */

import { useState, useCallback, useEffect } from "react";
import { modelManager, type ModelProgress, type ModelStatus } from "@/lib/ai/modelManager";
import {
    runTextInference,
    runImageInference,
    runMultimodalInference,
    type TriageResultData,
    type TriageInput,
} from "@/lib/ai/inferenceEngine";
import { offlineStore } from "@/lib/ai/offlineStore";

interface AIEngineState {
    modelStatus: ModelStatus;
    modelProgress: ModelProgress;
    isInferring: boolean;
    isOffline: boolean;
    lastResult: TriageResultData | null;
    error: string | null;
}

export function useAIEngine() {
    const [state, setState] = useState<AIEngineState>({
        modelStatus: "idle",
        modelProgress: { status: "idle", progress: 0, text: "" },
        isInferring: false,
        isOffline: !navigator.onLine,
        lastResult: null,
        error: null,
    });

    // Listen for online/offline events
    useEffect(() => {
        const handleOnline = () => setState((s) => ({ ...s, isOffline: false }));
        const handleOffline = () => setState((s) => ({ ...s, isOffline: true }));

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    const loadModel = useCallback(async () => {
        const success = await modelManager.initModel((progress) => {
            setState((s) => ({
                ...s,
                modelStatus: progress.status,
                modelProgress: progress,
            }));
        });

        if (!success) {
            setState((s) => ({
                ...s,
                modelStatus: modelManager.getStatus(),
            }));
        }
    }, []);

    const runTriage = useCallback(
        async (input: TriageInput): Promise<TriageResultData | null> => {
            setState((s) => ({ ...s, isInferring: true, error: null }));

            try {
                let result: TriageResultData;

                if (input.source === "TEXT" && input.symptomsText) {
                    result = await runTextInference(input.symptomsText);
                } else if (input.source === "IMAGE" && input.image) {
                    result = await runImageInference(
                        input.symptomsText || "",
                        input.image
                    );
                } else if (
                    input.source === "MULTIMODAL" &&
                    input.symptomsText &&
                    input.image
                ) {
                    result = await runMultimodalInference(
                        input.symptomsText,
                        input.image
                    );
                } else {
                    throw new Error("Invalid triage input");
                }

                // Save to offline store
                await offlineStore.saveSession(
                    result.sessionId,
                    input.symptomsText || "",
                    input.source,
                    result
                );

                setState((s) => ({
                    ...s,
                    isInferring: false,
                    lastResult: result,
                }));

                return result;
            } catch (error) {
                const message =
                    error instanceof Error ? error.message : "Triage failed";
                setState((s) => ({
                    ...s,
                    isInferring: false,
                    error: message,
                }));
                return null;
            }
        },
        []
    );

    const unloadModel = useCallback(async () => {
        await modelManager.unloadModel();
        setState((s) => ({ ...s, modelStatus: "idle" }));
    }, []);

    return {
        ...state,
        loadModel,
        runTriage,
        unloadModel,
    };
}
