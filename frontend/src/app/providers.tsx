import React from "react";
import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { AuthResponse, LoginPayload, RegisterPayload, User } from "@/types";
import { authService } from "@/services/auth.service";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (payload: LoginPayload) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }): React.ReactNode {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedTokens = localStorage.getItem("tokens");
        if (storedUser && storedTokens) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const handleAuthResponse = useCallback((data: AuthResponse): void => {
        const mappedUser: User = {
            id: data.user.id,
            email: data.user.email,
            firstName: data.user.firstName ?? (data.user as unknown as Record<string, string>).first_name,
            lastName: data.user.lastName ?? (data.user as unknown as Record<string, string>).last_name,
            role: data.user.role,
        };
        localStorage.setItem("tokens", JSON.stringify(data.tokens));
        localStorage.setItem("user", JSON.stringify(mappedUser));
        setUser(mappedUser);
    }, []);

    const login = useCallback(async (payload: LoginPayload): Promise<void> => {
        const data = await authService.login(payload);
        handleAuthResponse(data);
    }, [handleAuthResponse]);

    const register = useCallback(async (payload: RegisterPayload): Promise<void> => {
        const data = await authService.register(payload);
        handleAuthResponse(data);
    }, [handleAuthResponse]);

    const logout = useCallback(async (): Promise<void> => {
        const tokensRaw = localStorage.getItem("tokens");
        if (tokensRaw) {
            try {
                const tokens = JSON.parse(tokensRaw);
                await authService.logout(tokens.refresh);
            } catch {
                // Token may already be expired — proceed with local logout
            }
        }
        localStorage.removeItem("tokens");
        localStorage.removeItem("user");
        setUser(null);
    }, []);

    const value = useMemo(
        () => ({
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            register,
            logout,
        }),
        [user, isLoading, login, register, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
