import { useState } from "react";
import { createPortal } from "react-dom";
import { LogOut, UserRound } from "lucide-react";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function LogoutButton() {
    const { handleLogout, loading, user } = useAuth();
    const navigate = useNavigate();
    const [confirming, setConfirming] = useState(false);

    const onLogout = async () => {
        await handleLogout();
        navigate("/login", { replace: true });
    };

    return (
        <>
            {user?.isGuest && (
                <>
                    <span className="hidden text-xs font-semibold text-[#797174] sm:inline">Guest session</span>
                    <Link to="/register" aria-label="Create account" title="Create account" className="dashboard-home-button inline-flex h-10 w-10 items-center justify-center rounded-full border px-2 text-sm font-semibold sm:w-auto sm:px-4">
                        <UserRound size={17} className="sm:hidden" />
                        <span className="hidden sm:inline">Create account</span>
                    </Link>
                </>
            )}
            <button
                type="button"
                onClick={() => setConfirming(true)}
                disabled={loading}
                className="dashboard-home-button inline-flex h-10 items-center gap-2 rounded-full border px-3 text-sm font-semibold disabled:cursor-wait disabled:opacity-60 sm:px-4"
                aria-label={user?.isGuest ? "End guest session" : "Log out"}
                title={user?.isGuest ? "End guest session" : "Log out"}
            >
                <LogOut size={18} />
                <span className="hidden sm:inline">{user?.isGuest ? "End guest session" : "Log out"}</span>
            </button>
            {confirming && createPortal(
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget && !loading) setConfirming(false);
                    }}
                >
                    <section
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="logout-dialog-title"
                        aria-describedby="logout-dialog-description"
                        className="dashboard-card w-full max-w-sm rounded-2xl border p-6 shadow-2xl"
                    >
                        <h2 id="logout-dialog-title" className="dashboard-modal-title text-lg font-bold">{user?.isGuest ? "End guest session?" : "Log out?"}</h2>
                        <p id="logout-dialog-description" className="dashboard-modal-copy mt-2 text-sm leading-6">
                            {user?.isGuest ? "Your guest reports are tied to this temporary session. Ending it will make them unavailable." : "Are you sure you want to log out of your account?"}
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setConfirming(false)}
                                disabled={loading}
                                className="dashboard-home-button h-10 rounded-xl border px-4 text-sm font-semibold disabled:opacity-60"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={onLogout}
                                disabled={loading}
                                className="dashboard-generate-button inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-60"
                            >
                                <LogOut size={16} />
                                {loading ? "Logging out..." : user?.isGuest ? "End session" : "Log out"}
                            </button>
                        </div>
                    </section>
                </div>,
                document.body
            )}
        </>
    );
}
