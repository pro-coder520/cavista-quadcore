import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/shared/ui/Logo";
import { Button } from "@/shared/ui/Button";

export function TopNav(): React.ReactNode {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async (): Promise<void> => {
        await logout();
        navigate("/login");
    };

    return (
        <header className="h-16 border-b border-[var(--color-border)] bg-white flex items-center justify-between px-6">
            <Link to="/dashboard">
                <Logo size="sm" />
            </Link>

            <div className="flex items-center gap-4">
                <span className="text-sm text-[var(--color-text-secondary)]">
                    {user?.firstName} {user?.lastName}
                </span>
                <span className="text-xs font-medium px-2 py-1 rounded-md bg-[var(--color-primary)] text-white uppercase">
                    {user?.role}
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                    Sign Out
                </Button>
            </div>
        </header>
    );
}
