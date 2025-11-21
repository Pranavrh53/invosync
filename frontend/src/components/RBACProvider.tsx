import { createContext, useContext, ReactNode } from "react";

export type UserRole = "admin" | "accountant" | "sales" | "viewer";

interface AuthContextProps {
    role: UserRole;
    setRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function RBACProvider({ children }: { children: ReactNode }) {
    // For demo purposes we just default to admin. Replace with real auth logic.
    const [role, setRole] = React.useState<UserRole>("admin");
    return (
        <AuthContext.Provider value={{ role, setRole }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useRBAC() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useRBAC must be used within RBACProvider");
    return ctx;
}
