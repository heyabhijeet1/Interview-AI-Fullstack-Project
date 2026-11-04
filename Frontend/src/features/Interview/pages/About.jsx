import { ArrowRight, BarChart3, CalendarDays, FileText, Sparkles, Target } from "lucide-react";
import { Link } from "react-router";
import ThemeToggle from "../../../theme/ThemeToggle.jsx";
import LogoutButton from "../../auth/components/LogoutButton.jsx";
import DashboardNav from "../components/DashboardNav.jsx";

const About = () => (
    <main className="dashboard-main min-h-screen bg-[#F4F1F0] text-[#393436]">
        <header className="dashboard-header fixed inset-x-0 top-0 z-30 backdrop-blur-xl">
            <div className="mx-auto flex h-14 max-w-[1544px] items-center justify-between px-3 sm:px-8 lg:px-10">
                <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="Interview AI home">
                    <span className="dashboard-logo-mark flex h-8 w-8 items-center justify-center rounded-xl text-white shadow-lg sm:h-9 sm:w-9"><Sparkles size={19} /></span>
                    <span className="text-sm font-bold tracking-tight text-[#393436] sm:text-xl">Interview <span className="text-[#F03260]">AI</span></span>
                </Link>
                <div className="flex items-center gap-1 sm:gap-3">
                    <DashboardNav active="about" />
                    <ThemeToggle className="h-9 w-9 border border-[#EAE3E1] bg-white text-[#393436] sm:h-10 sm:w-10" />
                    <LogoutButton />
                </div>
            </div>
        </header>

        <div className="mx-auto max-w-[1200px] px-5 pb-12 pt-[76px] sm:px-8 lg:px-10">
            <section className="mx-auto max-w-3xl text-center">
                <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#F03260]/25 bg-[#FCE8EC] px-3 py-1.5 text-xs font-semibold text-[#F03260]">
                    <Sparkles size={14} /> About Interview AI
                </p>
                <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-[#393436] sm:text-5xl">
                    Prepare with a plan built for <span className="dashboard-title-accent">your next role.</span>
                </h1>
                <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#797174]">
                    Interview AI turns the role you want and the experience you bring into focused interview practice. Add a resume if you have one, then get role-specific questions, skill insights, and a practical preparation roadmap.
                </p>
            </section>

            <section className="mt-12 grid gap-4 md:grid-cols-3" aria-label="What Interview AI helps with">
                <article className="dashboard-card rounded-2xl border p-6">
                    <span className="dashboard-icon flex h-12 w-12 items-center justify-center rounded-xl text-[#F03260]"><FileText size={22} /></span>
                    <h2 className="mt-5 text-lg font-bold text-[#393436]">Understand the role</h2>
                    <p className="mt-2 text-sm leading-6 text-[#797174]">Turn a job description into focused technical and behavioral questions, with guidance on what each question explores.</p>
                </article>
                <article className="dashboard-card rounded-2xl border p-6">
                    <span className="dashboard-icon flex h-12 w-12 items-center justify-center rounded-xl text-[#F03260]"><Target size={22} /></span>
                    <h2 className="mt-5 text-lg font-bold text-[#393436]">See where you stand</h2>
                    <p className="mt-2 text-sm leading-6 text-[#797174]">Compare your background with the role and identify skills that may need more attention before the interview.</p>
                </article>
                <article className="dashboard-card rounded-2xl border p-6">
                    <span className="dashboard-icon flex h-12 w-12 items-center justify-center rounded-xl text-[#F03260]"><CalendarDays size={22} /></span>
                    <h2 className="mt-5 text-lg font-bold text-[#393436]">Know what to do next</h2>
                    <p className="mt-2 text-sm leading-6 text-[#797174]">Use a day-by-day roadmap to focus your study time and build confidence at a steady pace.</p>
                </article>
            </section>

            <section className="dashboard-card mt-8 grid gap-8 rounded-2xl border p-6 sm:p-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F03260]">Simple process</p>
                    <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#393436]">From job post to interview-ready.</h2>
                    <p className="mt-3 text-sm leading-6 text-[#797174]">Start with the information you have. A resume is optional; your job description and self description are enough to begin.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                    {[
                        ["01", "Share the role", "Paste the job description."],
                        ["02", "Add your profile", "Describe your skills and experience."],
                        ["03", "Prepare with focus", "Review questions and your roadmap."],
                    ].map(([step, title, description]) => (
                        <div key={step} className="dashboard-step-card rounded-xl border p-4">
                            <span className="text-xs font-extrabold tracking-wider text-[#F03260]">{step}</span>
                            <h3 className="mt-2 text-sm font-bold text-[#393436]">{title}</h3>
                            <p className="mt-1 text-xs leading-5 text-[#797174]">{description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <div className="mt-9 flex justify-center">
                <Link to="/" className="dashboard-generate-button inline-flex items-center gap-3 rounded-xl px-6 py-3.5 text-sm font-bold text-white transition hover:brightness-110">
                    <BarChart3 size={18} /> Build my interview plan <ArrowRight size={19} />
                </Link>
            </div>
            <footer className="pt-10 text-center text-xs text-[#A49B9D]">Interview AI · Prepare smarter. Interview better.</footer>
        </div>
    </main>
);

export default About;
