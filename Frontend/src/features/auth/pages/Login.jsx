import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { ArrowRight, BarChart3, Eye, EyeOff, Lock, Mail, Sparkles, Target, Zap } from "lucide-react";
import ThemeToggle from "../../../theme/ThemeToggle.jsx";
import interviewHero from "../../../assets/interview-login-hero.png";

const Login = () => {
    const { loading, handleLogin, handleGuestLogin } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (loading) return;
        setLoginError("");
        try {
            const result = await handleLogin({ email, password });
            if (result?.success) {
                navigate("/");
            } else {
                setLoginError(result?.message || "Invalid email or password. Please try again.");
            }
        } catch {
            setLoginError("Unable to log in. Please try again.");
        }
    };

    const continueAsGuest = async () => {
        setLoginError("");
        const result = await handleGuestLogin();
        if (result?.success) navigate("/");
        else setLoginError(result?.message || "Could not start a guest session. Please try again.");
    };

    return (
        <main className="auth-login-page min-h-screen bg-[#F4F1F0] text-[#393436]">
            <header className="auth-login-header fixed inset-x-0 top-0 z-30 border-b backdrop-blur-xl">
                <div className="mx-auto flex h-14 max-w-[1544px] items-center justify-between px-5 sm:px-8 lg:px-10">
                    <Link to="/" className="flex items-center gap-3" aria-label="Interview AI home">
                        <span className="dashboard-logo-mark flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-lg"><Sparkles size={21} /></span>
                        <span className="text-lg font-bold tracking-tight text-[#393436] sm:text-xl">Interview <span className="text-[#F03260]">AI</span></span>
                    </Link>
                    <ThemeToggle className="h-10 w-10 border border-[#EAE3E1] bg-white text-[#393436]" />
                </div>
            </header>

            <div className="mx-auto grid max-w-[1544px] items-center gap-10 px-5 pb-8 pt-[88px] sm:px-8 sm:pb-10 lg:min-h-[calc(100vh-56px)] lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 lg:px-10 lg:pb-12 lg:pt-[88px]">
                <section className="auth-login-hero" aria-labelledby="login-hero-title">
                    <div className="auth-hero-art-wrap">
                        <img src={interviewHero} alt="Laptop with an interview preparation checklist, books, a plant, and coffee" className="auth-hero-art" />
                    </div>
                    <div id="about" className="scroll-mt-24">
                        <h1 id="login-hero-title" className="text-3xl font-extrabold leading-tight tracking-tight text-[#393436] sm:text-4xl lg:text-[42px]">
                            Ace Your Interviews with <span className="dashboard-title-accent">Interview AI</span>
                        </h1>
                        <p className="mt-4 max-w-2xl text-base leading-7 text-[#797174] sm:text-lg">
                            Turn your job description, resume, and self-profile into a personalized interview report with AI.
                        </p>
                    </div>

                    <div id="features" className="auth-feature-list mt-7 grid grid-cols-3 scroll-mt-24">
                        <div className="auth-feature-item">
                            <span className="auth-feature-icon"><Target size={24} /></span>
                            <span>Role Analysis</span>
                        </div>
                        <div className="auth-feature-item">
                            <span className="auth-feature-icon"><BarChart3 size={24} /></span>
                            <span>Skill Assessment</span>
                        </div>
                        <div className="auth-feature-item">
                            <span className="auth-feature-icon"><Zap size={24} /></span>
                            <span>Interview Preparation</span>
                        </div>

                    </div>
                </section>

                <form onSubmit={handleSubmit} className="auth-login-card mx-auto w-full max-w-[680px] rounded-[26px] border p-6 shadow-2xl sm:p-8 lg:p-10">
                    <div className="mb-7 text-center">
                        <Link to="/" className="mb-5 inline-flex items-center justify-center gap-3" aria-label="Interview AI home">
                            <span className="dashboard-logo-mark flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-lg"><Sparkles size={25} /></span>
                            <span className="text-2xl font-bold tracking-tight text-[#393436]">Interview <span className="text-[#F03260]">AI</span></span>
                        </Link>
                        <h2 className="text-3xl font-extrabold tracking-tight text-[#393436]">Welcome Back</h2>
                        <p className="mt-2 text-sm text-[#797174] sm:text-base">Login to continue your interview preparation.</p>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label htmlFor="login-email" className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#393436]">
                                <Mail size={17} className="text-[#F03260]" /> Email
                            </label>
                            <input
                                id="login-email"
                                onChange={(event) => setEmail(event.target.value)}
                                value={email}
                                type="email"
                                placeholder="Enter your email"
                                autoComplete="email"
                                required
                                className="auth-login-field w-full rounded-xl border px-4 py-3.5 text-sm outline-none transition placeholder:text-[#A49B9D] focus:border-[#F03260] focus:ring-2 focus:ring-[#F03260]/20"
                            />
                        </div>

                        <div>
                            <label htmlFor="login-password" className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#393436]">
                                <Lock size={17} className="text-[#F03260]" /> Password
                            </label>
                            <div className="relative">
                                <input
                                    id="login-password"
                                    onChange={(event) => setPassword(event.target.value)}
                                    value={password}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                    className="auth-login-field w-full rounded-xl border px-4 py-3.5 pr-12 text-sm outline-none transition placeholder:text-[#A49B9D] focus:border-[#F03260] focus:ring-2 focus:ring-[#F03260]/20"
                                />
                                <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[#A49B9D] transition hover:text-[#F03260]">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {loginError && <p role="alert" aria-live="assertive" className="auth-login-error mt-4 rounded-lg border px-3 py-2 text-sm font-medium">{loginError}</p>}

                    <button type="submit" disabled={loading} className="dashboard-generate-button mt-7 flex w-full items-center justify-center gap-3 rounded-xl px-5 py-4 text-base font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
                        {loading ? <><span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Logging in...</> : <>Login <ArrowRight size={21} /></>}
                    </button>

                    <button type="button" onClick={continueAsGuest} disabled={loading} className="dashboard-home-button mt-3 w-full rounded-xl border px-5 py-3.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60">
                        Continue as guest
                    </button>
                    <p className="mt-2 text-center text-xs text-[#797174]">Guest reports are temporary and expire after 24 hours.</p>

                    <p className="mt-7 text-center text-sm text-[#797174]">
                        Don&apos;t have an account? <Link to="/register" className="ml-1 font-semibold text-[#F03260] hover:underline">Sign Up</Link>
                    </p>
                </form>
            </div>
        </main>
    );
};

export default Login;
