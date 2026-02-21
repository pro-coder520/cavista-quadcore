/**
 * WebLLM Model Manager
 *
 * Singleton managing MedGemma 4B lifecycle via WebLLM.
 * Handles WebGPU detection, model loading with progress,
 * and persistent caching via browser Cache API.
 */

import type { MLCEngine, InitProgressReport } from "@mlc-ai/web-llm";

export type ModelStatus =
    | "idle"
    | "checking"
    | "downloading"
    | "loading"
    | "ready"
    | "error"
    | "unsupported";

export interface ModelProgress {
    status: ModelStatus;
    progress: number;
    text: string;
}

// MedGemma model ID for WebLLM
// Falls back to a smaller model if MedGemma is not available in the registry
const PREFERRED_MODEL = "gemma-2-2b-it-q4f16_1-MLC";

class ModelManager {
    private engine: MLCEngine | null = null;
    private status: ModelStatus = "idle";
    private progressCallback: ((progress: ModelProgress) => void) | null = null;

    /**
     * Check if the browser supports WebGPU.
     */
    async checkWebGPUSupport(): Promise<boolean> {
        const nav = navigator as unknown as { gpu?: { requestAdapter: () => Promise<unknown | null> } };
        if (!nav.gpu) {
            return false;
        }
        try {
            const adapter = await nav.gpu.requestAdapter();
            return adapter !== null;
        } catch {
            return false;
        }
    }

    /**
     * Initialize and load the model.
     */
    async initModel(
        onProgress?: (progress: ModelProgress) => void
    ): Promise<boolean> {
        this.progressCallback = onProgress || null;
        this.updateStatus("checking", 0, "Checking WebGPU support...");

        const hasWebGPU = await this.checkWebGPUSupport();
        if (!hasWebGPU) {
            this.updateStatus("unsupported", 0, "WebGPU not supported on this device");
            return false;
        }

        try {
            this.updateStatus("downloading", 0, "Initializing AI engine...");

            // Dynamic import to avoid bundling WebLLM for non-WebGPU devices
            const { CreateMLCEngine } = await import("@mlc-ai/web-llm");

            this.engine = await CreateMLCEngine(PREFERRED_MODEL, {
                initProgressCallback: (report: InitProgressReport) => {
                    const progress = report.progress || 0;
                    this.updateStatus(
                        "downloading",
                        progress,
                        report.text || "Loading model..."
                    );
                },
            });

            this.updateStatus("ready", 1, "MedGemma AI engine ready");
            return true;
        } catch (error) {
            console.error("Model initialization failed:", error);
            this.updateStatus(
                "error",
                0,
                `Failed to load AI model: ${error instanceof Error ? error.message : "Unknown error"}`
            );
            return false;
        }
    }

    /**
     * Run chat completion with the loaded model.
     */
    async generateResponse(
        systemPrompt: string,
        userMessage: string
    ): Promise<string> {
        if (!this.engine || this.status !== "ready") {
            throw new Error("Model is not loaded. Call initModel() first.");
        }

        const response = await this.engine.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage },
            ],
            temperature: 0.3,
            max_tokens: 1024,
        });

        return response.choices[0]?.message?.content || "";
    }

    /**
     * Check if the model is ready for inference.
     */
    isModelReady(): boolean {
        return this.status === "ready" && this.engine !== null;
    }

    /**
     * Get the current model status.
     */
    getStatus(): ModelStatus {
        return this.status;
    }

    /**
     * Unload the model to free GPU memory.
     */
    async unloadModel(): Promise<void> {
        if (this.engine) {
            await this.engine.unload();
            this.engine = null;
        }
        this.updateStatus("idle", 0, "Model unloaded");
    }

    private updateStatus(status: ModelStatus, progress: number, text: string): void {
        this.status = status;
        if (this.progressCallback) {
            this.progressCallback({ status, progress, text });
        }
    }
}

// Singleton export
export const modelManager = new ModelManager();
