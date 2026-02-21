export type UserRole = "PATIENT" | "CLINICIAN" | "SPONSOR" | "ADMIN";

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isVerified?: boolean;
    mfaEnabled?: boolean;
    dateJoined?: string;
}

export interface AuthTokens {
    access: string;
    refresh: string;
}

export interface AuthResponse {
    user: User;
    tokens: AuthTokens;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: UserRole;
}

export interface ApiError {
    error: string;
}
