import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/types";
import { LandingPage } from "@/features/landing/LandingPage";
import { LoginPage } from "@/features/auth/LoginPage";
import { RegisterPage } from "@/features/auth/RegisterPage";
import { ForgotPasswordPage } from "@/features/auth/ForgotPasswordPage";
import { PatientDashboard } from "@/features/dashboard/PatientDashboard";
import { ClinicianDashboard } from "@/features/dashboard/ClinicianDashboard";
import { SponsorDashboard } from "@/features/dashboard/SponsorDashboard";
import { DashboardLayout } from "@/shared/layout/DashboardLayout";
import { TriagePage } from "@/features/triage/TriagePage";

function ProtectedRoute({
    children,
    allowedRoles,
}: {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}): React.ReactNode {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

function DashboardRedirect(): React.ReactNode {
    const { user } = useAuth();

    switch (user?.role) {
        case "PATIENT":
            return <Navigate to="/dashboard/patient" replace />;
        case "CLINICIAN":
            return <Navigate to="/dashboard/clinician" replace />;
        case "SPONSOR":
            return <Navigate to="/dashboard/sponsor" replace />;
        default:
            return <Navigate to="/login" replace />;
    }
}

export function AppRouter(): React.ReactNode {
    return (
        <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Protected — Dashboard */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardRedirect />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard/patient"
                element={
                    <ProtectedRoute allowedRoles={["PATIENT"]}>
                        <DashboardLayout>
                            <PatientDashboard />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard/patient/triage"
                element={
                    <ProtectedRoute allowedRoles={["PATIENT"]}>
                        <DashboardLayout>
                            <TriagePage />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard/clinician"
                element={
                    <ProtectedRoute allowedRoles={["CLINICIAN"]}>
                        <DashboardLayout>
                            <ClinicianDashboard />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard/clinician/triage"
                element={
                    <ProtectedRoute allowedRoles={["CLINICIAN"]}>
                        <DashboardLayout>
                            <TriagePage />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard/sponsor"
                element={
                    <ProtectedRoute allowedRoles={["SPONSOR"]}>
                        <DashboardLayout>
                            <SponsorDashboard />
                        </DashboardLayout>
                    </ProtectedRoute>
                }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
