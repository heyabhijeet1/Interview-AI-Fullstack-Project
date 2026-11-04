import { useEffect, useRef, useState } from "react";
import { Files, House, Info, Menu, X } from "lucide-react";
import { Link } from "react-router";

const links = [
    { to: "/", id: "home", label: "Home", icon: House },
    { to: "/reports", id: "reports", label: "Reports", icon: Files },
    { to: "/about", id: "about", label: "About", icon: Info },
];

export default function DashboardNav({ active }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const triggerRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return undefined;

        const handlePointerDown = (event) => {
            if (!menuRef.current?.contains(event.target) && !triggerRef.current?.contains(event.target)) {
                setIsOpen(false);
            }
        };
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setIsOpen(false);
                triggerRef.current?.focus();
            }
        };

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    return (
        <>
            <nav className="hidden items-center gap-0.5 sm:flex sm:gap-1" aria-label="Main navigation">
                {links.map(({ to, id, label, icon: Icon }) => (
                    <Link
                        key={id}
                        to={to}
                        className={`dashboard-icon-nav-link h-9 w-9 ${active === id ? "dashboard-icon-nav-link-active" : ""}`}
                        aria-label={label}
                        aria-current={active === id ? "page" : undefined}
                        title={label}
                    >
                        <Icon size={18} />
                    </Link>
                ))}
            </nav>

            <div className="relative order-last sm:hidden">
                <button
                    ref={triggerRef}
                    type="button"
                    onClick={() => setIsOpen((open) => !open)}
                    className="dashboard-home-button flex h-9 w-9 items-center justify-center rounded-xl border"
                    aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={isOpen}
                    aria-controls="mobile-dashboard-navigation"
                    title="Menu"
                >
                    {isOpen ? <X size={19} /> : <Menu size={19} />}
                </button>
                {isOpen && (
                    <nav
                        id="mobile-dashboard-navigation"
                        ref={menuRef}
                        aria-label="Main navigation"
                        className="dashboard-card absolute right-0 top-full z-50 mt-2 flex min-w-48 flex-col gap-1 rounded-xl border p-2 shadow-xl"
                    >
                        {links.map(({ to, id, label, icon: Icon }) => (
                            <Link
                                key={id}
                                to={to}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${active === id ? "dashboard-icon-nav-link-active" : "text-[#797174] hover:bg-[#FCE8EC]"}`}
                                aria-current={active === id ? "page" : undefined}
                            >
                                <Icon size={18} /> {label}
                            </Link>
                        ))}
                    </nav>
                )}
            </div>
        </>
    );
}
