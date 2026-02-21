import api from "@/services/api";
import type { AuthResponse, LoginPayload, RegisterPayload, User } from "@/types";

export const authService = {
    async login(payload: LoginPayload): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>("/auth/login/", payload);
        return response.data;
    },

    async register(payload: RegisterPayload): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>("/auth/register/", payload);
        return response.data;
    },

    async refreshToken(refresh: string): Promise<{ access: string; refresh: string }> {
        const response = await api.post("/auth/token/refresh/", { refresh });
        return response.data;
    },

    async logout(refresh: string): Promise<void> {
        await api.post("/auth/logout/", { refresh });
    },

    async getProfile(): Promise<User> {
        const response = await api.get<User>("/auth/profile/");
        return response.data;
    },

    async forgotPassword(email: string): Promise<void> {
        await api.post("/auth/forgot-password/", { email });
    },
};
