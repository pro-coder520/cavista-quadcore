import api from "@/services/api";

export interface TriageSessionResponse {
    id: string;
    source: string;
    status: string;
    symptoms_text: string;
    inference_mode: string;
    model_version: string;
    result: {
        id: string;
        diagnosis: string;
        severity: string;
        confidence_score: number;
        recommendations: string[];
        differential_diagnoses: { condition: string; confidence: number }[];
        explainability: Record<string, unknown>;
        created_at: string;
    } | null;
    images: {
        id: string;
        classification: string;
        classification_confidence: number;
        original_filename: string;
        created_at: string;
    }[];
    created_at: string;
}

export const triageService = {
    getSessions: (): Promise<{ data: { results: TriageSessionResponse[] } }> =>
        api.get("/triage/sessions/"),

    getSession: (id: string): Promise<{ data: TriageSessionResponse }> =>
        api.get(`/triage/sessions/${id}/`),

    createSession: (data: {
        symptoms_text: string;
        source: string;
        inference_mode: string;
        model_version?: string;
        device_info?: Record<string, unknown>;
    }): Promise<{ data: TriageSessionResponse }> =>
        api.post("/triage/sessions/", data),

    saveResult: (data: {
        session_id: string;
        diagnosis: string;
        severity: string;
        confidence_score: number;
        recommendations?: string[];
        differential_diagnoses?: { condition: string; confidence: number }[];
        explainability?: Record<string, unknown>;
    }): Promise<{ data: { id: string; status: string } }> =>
        api.post("/triage/results/", data),

    runServerInference: (data: {
        symptoms_text: string;
        source: string;
    }): Promise<{ data: TriageSessionResponse }> =>
        api.post("/triage/inference/", data),

    uploadImage: (
        sessionId: string,
        image: File
    ): Promise<{ data: { id: string; status: string } }> => {
        const formData = new FormData();
        formData.append("session_id", sessionId);
        formData.append("image", image);
        return api.post("/triage/images/", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
};
