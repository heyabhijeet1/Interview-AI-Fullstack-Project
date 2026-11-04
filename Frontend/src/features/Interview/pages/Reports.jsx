import { ArrowUpRight, Clock3, FileText, Files, LoaderCircle, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { useInterview } from "../hooks/useInterview";
import ThemeToggle from "../../../theme/ThemeToggle.jsx";
import LogoutButton from "../../auth/components/LogoutButton.jsx";
import { useAuth } from "../../auth/hooks/useAuth.js";
import DashboardNav from "../components/DashboardNav.jsx";

const Reports = () => {
    const { reports = [], loading, reportsError } = useInterview();
    const { user } = useAuth();
    const isGuest = user?.isGuest;

    return (
        <main className="dashboard-main min-h-screen bg-[#F4F1F0] text-[#393436]">
            <header className="dashboard-header fixed inset-x-0 top-0 z-30 backdrop-blur-xl">
                <div className="mx-auto flex h-14 max-w-[1544px] items-center justify-between px-3 sm:px-8 lg:px-10">
                    <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="Interview AI home">
                        <span className="dashboard-logo-mark flex h-8 w-8 items-center justify-center rounded-xl text-white shadow-lg sm:h-9 sm:w-9"><Sparkles size={19} /></span>
                        <span className="text-sm font-bold tracking-tight text-[#393436] sm:text-xl">Interview <span className="text-[#F03260]">AI</span></span>
                    </Link>
                    <div className="flex items-center gap-1 sm:gap-3">
                        <DashboardNav active="reports" />
                        <ThemeToggle className="h-9 w-9 border border-[#EAE3E1] bg-white text-[#393436] sm:h-10 sm:w-10" />
                        <LogoutButton />
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-[1280px] px-5 pb-12 pt-[76px] sm:px-8 lg:px-10">
                <section className="mb-8">
                    <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#F03260]/25 bg-[#FCE8EC] px-3 py-1.5 text-xs font-semibold text-[#F03260]">
                        <Clock3 size={14} /> Your interview prep library
                    </p>
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-[#393436] sm:text-4xl">Your Reports</h1>
                            <p className="mt-2 text-sm text-[#797174]">{isGuest ? "Create a free account to access and keep your reports." : "All your generated interview preparation reports, newest first."}</p>
                        </div>
                        {!isGuest && <span className="rounded-full border border-[#EAE3E1] bg-white px-4 py-2 text-sm font-semibold text-[#797174]">
                            {reports.length} {reports.length === 1 ? "report" : "reports"}
                        </span>}
                    </div>
                </section>

                {isGuest ? (
                    <section className="dashboard-card flex min-h-72 flex-col items-center justify-center rounded-2xl border px-6 py-12 text-center">
                        <span className="dashboard-icon flex h-14 w-14 items-center justify-center rounded-2xl text-[#F03260]"><Files size={25} /></span>
                        <h2 className="mt-4 text-lg font-bold text-[#393436]">Sign up to access your reports</h2>
                        <p className="mt-2 max-w-lg text-sm leading-6 text-[#797174]">Your reports from this guest session will be added to your account when you sign up.</p>
                        <Link to="/register" className="dashboard-generate-button mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition hover:brightness-110"><Sparkles size={17} /> Create your free account</Link>
                        <Link to="/" className="mt-4 text-sm font-semibold text-[#F03260] hover:underline">Continue preparing</Link>
                    </section>
                ) : loading ? (
                    <div className="dashboard-card flex min-h-56 flex-col items-center justify-center rounded-2xl border p-8 text-center">
                        <LoaderCircle size={32} className="animate-spin text-[#F03260]" />
                        <p className="mt-3 text-sm font-semibold text-[#797174]">Loading your reports...</p>
                    </div>
                ) : reportsError ? (
                    <section role="alert" className="dashboard-card flex min-h-64 flex-col items-center justify-center rounded-2xl border px-6 py-12 text-center">
                        <span className="dashboard-icon flex h-14 w-14 items-center justify-center rounded-2xl text-[#F03260]"><FileText size={25} /></span>
                        <h2 className="mt-4 text-lg font-bold text-[#393436]">Reports couldn’t be loaded</h2>
                        <p className="mt-1 max-w-md text-sm leading-6 text-[#797174]">{reportsError}</p>
                    </section>
                ) : reports.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {reports.map((report) => (
                            <Link key={report._id} to={`/interview/${report._id}`} className="dashboard-report-link group flex min-h-36 items-center justify-between gap-4 rounded-2xl border p-5 text-left transition">
                                <span className="flex min-w-0 items-start gap-3">
                                    <span className="dashboard-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[#F03260]"><FileText size={21} /></span>
                                    <span className="min-w-0 pt-0.5">
                                        <span className="block truncate text-base font-bold text-[#393436]">{report.title || "Interview report"}</span>
                                        <span className="mt-2 block text-xs text-[#797174]">
                                            {report.createdAt ? new Date(report.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "Recently generated"}
                                        </span>
                                        {typeof report.matchScore === "number" && <span className="mt-2 inline-flex rounded-full bg-[#FCE8EC] px-2.5 py-1 text-xs font-semibold text-[#F03260]">{report.matchScore}% match</span>}
                                    </span>
                                </span>
                                <ArrowUpRight size={18} className="shrink-0 text-[#A49B9D] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#F03260]" />
                            </Link>
                        ))}
                    </div>
                ) : (
                    <section className="dashboard-card flex min-h-64 flex-col items-center justify-center rounded-2xl border px-6 py-12 text-center">
                        <span className="dashboard-icon flex h-14 w-14 items-center justify-center rounded-2xl text-[#F03260]"><FileText size={25} /></span>
                        <h2 className="mt-4 text-lg font-bold text-[#393436]">No reports yet</h2>
                        <p className="mt-1 max-w-md text-sm leading-6 text-[#797174]">Generate your first personalized interview preparation report and it will show up here.</p>
                        <Link to="/" className="dashboard-generate-button mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition hover:brightness-110"><Sparkles size={17} /> Create a report</Link>
                    </section>
                )}

                <footer className="pt-10 text-center text-xs text-[#A49B9D]">Interview AI · Prepare smarter. Interview better.</footer>
            </div>
        </main>
    );
};

export default Reports;
