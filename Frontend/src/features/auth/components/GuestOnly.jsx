import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function GuestOnly({ children }) {
    const { user, initializing } = useAuth();

    if (initializing) return null;
    if (user && !user.isGuest) return <Navigate to="/" replace />;

    return children;
}
