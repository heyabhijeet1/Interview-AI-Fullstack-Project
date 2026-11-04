import { useState } from "react";
import {
    ChevronDown,
    ChevronUp,
    CheckCircle2,
    Circle,
    Target,
    CalendarDays,
    FileText,
    Sparkles,
    ClipboardCheck,
    Code2,
    Brain,
    Download,
    LoaderCircle,
    ClipboardList,
} from "lucide-react";
import { useInterview } from '../hooks/useInterview.js'
import { Link, useParams } from "react-router";
import { downloadResumePdf } from "../services/interview.api.js";
import ThemeToggle from "../../../theme/ThemeToggle.jsx";
import LogoutButton from "../../auth/components/LogoutButton.jsx";
import DashboardNav from "../components/DashboardNav.jsx";

const cardStyle =
    "dashboard-card rounded-2xl border";

function MatchCircle({ score }) {
    const radius = 43;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative flex h-[112px] w-[112px] items-center justify-center">
            <svg
                className="h-full w-full -rotate-90"
                viewBox="0 0 100 100"
            >
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="#EBDDE2"
                    strokeWidth="8"
                    className="match-circle-track"
                />

                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="#F03260"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference}
                    className="animate-match-ring"
                    style={{
                        "--match-offset": offset,
                    }}
                />
            </svg>

            <div className="absolute text-center">
                <p className="text-2xl font-bold text-[#393436]">
                    {score}%
                </p>
                <p className="text-[10px] font-medium text-[#797174]">
                    Match
                </p>
            </div>
        </div>
    );
}

function SectionHeading({ title, description }) {
    return (
        <div className="mb-5">
            <h2 className="text-lg font-bold text-[#393436] sm:text-xl">
                {title}
            </h2>

            <p className="mt-1 text-sm text-[#797174]">
                {description}
            </p>
        </div>
    );
}

function QuestionList({
    items,
    prefix,
    expandedQuestions,
    toggleQuestion,
}) {
    return (
        <div className="space-y-3">
            {items.map((item, index) => {
                const id = `${prefix}-${index}`;
                const expanded = !!expandedQuestions[id];

                return (
                    <article
                        key={id}
                        className={`dashboard-question-card overflow-hidden rounded-xl border transition-colors duration-200 ${expanded
                            ? "is-expanded border-[#F5C5D0] bg-[#FFFAFB]"
                            : "border-[#EAE3E1] bg-white"
                            }`}
                    >
                        <button
                            onClick={() => toggleQuestion(id)}
                            aria-expanded={expanded}
                            className="flex w-full items-center gap-3 p-4 text-left sm:p-5"
                        >
                            <span className="dashboard-question-number flex h-9 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FCE8EC] text-xs font-bold text-[#F03260]">
                                {String(index + 1).padStart(2, "0")}
                            </span>

                            <span className="flex-1 text-sm font-semibold leading-6 text-[#393436]">
                                {item.question}
                            </span>

                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F4F1F0] text-[#797174]">
                                {expanded ? (
                                    <ChevronUp size={16} />
                                ) : (
                                    <ChevronDown size={16} />
                                )}
                            </span>
                        </button>

                        <div
                            className={`grid transition-all duration-300 ease-in-out ${expanded
                                ? "grid-rows-[1fr] opacity-100"
                                : "grid-rows-[0fr] opacity-0"
                                }`}
                        >
                            <div className="overflow-hidden">
                                <div className="dashboard-answer-panel space-y-4 border-t border-[#F0E5E7] bg-[#FFFAFB] px-4 py-4 sm:px-5">
                                    <div>
                                        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#F03260]">
                                            Interviewer's intention
                                        </p>

                                        <p className="text-sm leading-6 text-[#797174]">
                                            {item.intention}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#F03260]">
                                            Suggested answer
                                        </p>

                                        <p className="text-sm leading-7 text-[#51494C]">
                                            {item.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}

function SkillGapPanel({ skillGaps }) {
    return (
        <div className={`${cardStyle} p-4`}>
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#393436]">
                    Skill gaps
                </h3>

                <span className="rounded-full bg-[#FCE8EC] px-2 py-1 text-[10px] font-semibold text-[#F03260]">
                    {skillGaps.length} areas
                </span>
            </div>

            <div className="space-y-4">
                {skillGaps.map((gap, index) => (
                    <div key={gap.skill || gap.shortName || index}>
                        <div className="mb-1.5 flex items-center justify-between gap-2">
                            <p className="text-xs font-medium text-[#51494C]">
                                {gap.skill || gap.shortName}
                            </p>

                            <span
                                className={`dashboard-severity-badge shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold severity-${String(gap.severity).toLowerCase()}`}
                            >
                                {gap.severity}
                            </span>
                        </div>

                        <div className="dashboard-skill-track h-1.5 overflow-hidden rounded-full">
                            <div
                                className={`dashboard-skill-fill h-full rounded-full severity-${String(gap.severity).toLowerCase()}`}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Roadmap({ preparationPlan, completedTasks, toggleTask }) {
    const totalTasks = preparationPlan.reduce(
        (total, day) => total + day.tasks.length,
        0
    );

    const completedCount =
        Object.values(completedTasks).filter(Boolean).length;

    const progress = Math.round((completedCount / totalTasks) * 100);

    return (
        <section>
            <SectionHeading
                title="7-day preparation roadmap"
                description="Work through your daily tasks and track your progress."
            />

            <div className={`${cardStyle} mb-5 p-4`}>
                <div className="mb-3 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-[#393436]">
                            Overall progress
                        </p>
                        <p className="mt-1 text-xs text-[#797174]">
                            {completedCount} of {totalTasks} tasks completed
                        </p>
                    </div>

                    <span className="text-xl font-bold text-[#F03260]">
                        {progress}%
                    </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-[#F0E9E7]">
                    <div
                        className="h-full rounded-full bg-[#F03260] transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="space-y-3">
                {preparationPlan.map((day) => (
                    <article key={day.day} className={`${cardStyle} p-4`}>
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-[#FCE8EC] text-[#F03260]">
                                <span className="text-[9px] font-bold uppercase">
                                    Day
                                </span>
                                <span className="text-base font-bold leading-none">
                                    {day.day}
                                </span>
                            </div>

                            <h3 className="text-sm font-bold text-[#393436]">
                                {day.focus}
                            </h3>
                        </div>

                        <div className="space-y-2">
                            {day.tasks.map((task, index) => {
                                const id = `${day.day}-${index}`;
                                const completed = !!completedTasks[id];

                                return (
                                    <button
                                        key={id}
                                        onClick={() => toggleTask(id)}
                                        className="flex w-full items-start gap-2.5 rounded-lg p-2 text-left transition hover:bg-[#FAF8F7]"
                                    >
                                        {completed ? (
                                            <CheckCircle2
                                                size={17}
                                                className="mt-0.5 shrink-0 text-[#F03260]"
                                            />
                                        ) : (
                                            <Circle
                                                size={17}
                                                className="mt-0.5 shrink-0 text-[#B7ACAF]"
                                            />
                                        )}

                                        <span
                                            className={`text-sm leading-6 ${completed
                                                ? "text-[#A79DA0] line-through"
                                                : "text-[#51494C]"
                                                }`}
                                        >
                                            {task}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default function Interview() {
    const [activeTab, setActiveTab] = useState("technical");
    const [expandedQuestions, setExpandedQuestions] = useState({});
    const [completedTasks, setCompletedTasks] = useState({});
    const [isDownloadingResume, setIsDownloadingResume] = useState(false);
    const { report, loading, reportError } = useInterview()
    const { interviewId } = useParams();

    const handleDownloadResume = async () => {
        if (!interviewId || isDownloadingResume) return;

        setIsDownloadingResume(true);
        try {
            const pdfBlob = await downloadResumePdf(interviewId);
            const downloadUrl = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = `tailored-resume-${interviewId}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.setTimeout(() => window.URL.revokeObjectURL(downloadUrl), 1000);
        } catch (error) {
            console.error("Failed to download resume PDF:", error);
            window.alert("Could not download the resume PDF. Please try again.");
        } finally {
            setIsDownloadingResume(false);
        }
    };
    const toggleQuestion = (id) => {
        setExpandedQuestions((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const toggleTask = (id) => {
        setCompletedTasks((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const reportMatchesRoute = report && String(report._id) === String(interviewId);
    if (!reportMatchesRoute && (loading || !reportError)) {
        return (
            <main className="dashboard-main flex min-h-screen items-center justify-center bg-[#F4F1F0] px-5 text-[#393436]" role="status" aria-live="polite">
                <section className="dashboard-card flex w-full max-w-sm flex-col items-center rounded-2xl border p-8 text-center shadow-xl">
                    <LoaderCircle size={42} className="animate-spin text-[#F03260]" />
                    <h1 className="mt-4 text-lg font-bold">Loading your report...</h1>
                    <p className="mt-2 text-sm text-[#797174]">We’re opening your personalized interview plan.</p>
                </section>
            </main>
        );
    }

    if (reportError || !reportMatchesRoute) {
        return (
            <main className="dashboard-main flex min-h-screen items-center justify-center bg-[#F4F1F0] px-5 text-[#393436]">
                <section role="alert" className="dashboard-card flex w-full max-w-lg flex-col items-center rounded-2xl border p-8 text-center shadow-xl">
                    <FileText size={36} className="text-[#F03260]" />
                    <h1 className="mt-4 text-xl font-bold">Report unavailable</h1>
                    <p className="mt-2 text-sm leading-6 text-[#797174]">{reportError || "We couldn’t find this report in your account."}</p>
                    <div className="mt-6 flex gap-3">
                        <Link to="/reports" className="dashboard-generate-button rounded-xl px-4 py-2.5 text-sm font-semibold text-white">Your reports</Link>
                        <Link to="/" className="dashboard-home-button rounded-xl border px-4 py-2.5 text-sm font-semibold">Home</Link>
                    </div>
                </section>
            </main>
        );
    }

    const interviewData = report;
    const tabs = [
        { id: "technical", label: "Technical", icon: Code2, count: interviewData.technicalQuestions.length },
        { id: "behavioral", label: "Behavioral", icon: Brain, count: interviewData.behavioralQuestions.length },
        { id: "roadmap", label: "Roadmap", icon: CalendarDays, count: interviewData.preparationPlan.length },
        { id: "summary", label: "Summary", icon: ClipboardList, count: 1 },
    ];

    return (
        <main className="dashboard-main min-h-screen bg-[#F4F1F0] text-[#393436]">
            <style>
                {`
          @keyframes match-ring-fill {
            from {
              stroke-dashoffset: 270;
            }
            to {
              stroke-dashoffset: var(--match-offset);
            }
          }

          .animate-match-ring {
            animation: match-ring-fill 1.1s ease-out forwards;
          }

          @media (prefers-reduced-motion: reduce) {
            .animate-match-ring {
              animation: none;
              stroke-dashoffset: var(--match-offset);
            }
          }
        `}
            </style>

            {/* Clean fixed header */}
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

            <div className="mx-auto max-w-[1500px] px-4 pb-10 pt-[80px] sm:px-6 lg:px-8">
                <div className="grid items-start gap-5 lg:grid-cols-[190px_minmax(0,1fr)_280px]">

                    {/* Left navigation */}
                    <aside className="min-w-0 lg:sticky lg:top-24">
                        <p className="mb-3 hidden px-2 text-[10px] font-bold uppercase tracking-wider text-[#A49A9D] lg:block">
                            Report sections
                        </p>

                        <nav className="dashboard-report-tabs flex gap-2 overflow-x-auto rounded-2xl border p-1.5 lg:flex-col lg:gap-1 lg:overflow-visible lg:p-2" aria-label="Report sections">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const active = activeTab === tab.id;

                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`dashboard-tab-button flex min-w-fit items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition ${active ? "dashboard-tab-button-active" : ""}`}
                                    >
                                        <Icon size={16} />

                                        <span className="flex-1">
                                            {tab.label}
                                        </span>

                                        <span
                                            className={`dashboard-tab-count rounded-md px-1.5 py-0.5 text-[10px] ${active ? "dashboard-tab-count-active" : ""}`}
                                        >
                                            {String(tab.count).padStart(2, "0")}
                                        </span>
                                    </button>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* Main content */}
                    <section className="min-w-0">
                        <div className="mb-5 flex items-start gap-3">
                            <span className="dashboard-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-[#F03260]"><FileText size={23} /></span>
                            <div>
                                <h1 className="text-2xl font-extrabold tracking-tight text-[#393436] sm:text-3xl">Interview Report</h1>
                                <p className="mt-1 text-sm leading-6 text-[#797174]">AI-generated interview preparation based on your job description, resume, and profile.</p>
                            </div>
                        </div>
                        {activeTab === "technical" && (
                            <section className="dashboard-card rounded-2xl border p-4 sm:p-5">
                                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <span className="dashboard-icon flex h-11 w-11 items-center justify-center rounded-xl text-[#F03260]"><Code2 size={21} /></span>
                                        <div>
                                            <h2 className="text-lg font-bold text-[#393436]">Technical <span className="text-[#F03260]">Questions</span></h2>
                                            <p className="mt-1 text-xs text-[#797174]">Review questions relevant to your target role.</p>
                                        </div>
                                    </div>
                                    <span className="dashboard-count-pill rounded-full px-3 py-1.5 text-xs font-semibold text-[#F03260]">{String(interviewData.technicalQuestions.length).padStart(2, "0")} Questions</span>
                                </div>
                                <QuestionList
                                    items={interviewData.technicalQuestions}
                                    prefix="technical"
                                    expandedQuestions={expandedQuestions}
                                    toggleQuestion={toggleQuestion}
                                />
                            </section>
                        )}

                        {activeTab === "behavioral" && (
                            <section className="dashboard-card rounded-2xl border p-4 sm:p-5">
                                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <span className="dashboard-icon flex h-11 w-11 items-center justify-center rounded-xl text-[#F03260]"><Brain size={21} /></span>
                                        <div>
                                            <h2 className="text-lg font-bold text-[#393436]">Behavioral <span className="text-[#F03260]">Questions</span></h2>
                                            <p className="mt-1 text-xs text-[#797174]">Practice answers that show your experience and judgment.</p>
                                        </div>
                                    </div>
                                    <span className="dashboard-count-pill rounded-full px-3 py-1.5 text-xs font-semibold text-[#F03260]">{String(interviewData.behavioralQuestions.length).padStart(2, "0")} Questions</span>
                                </div>
                                <QuestionList
                                    items={interviewData.behavioralQuestions}
                                    prefix="behavioral"
                                    expandedQuestions={expandedQuestions}
                                    toggleQuestion={toggleQuestion}
                                />
                            </section>
                        )}

                        {activeTab === "roadmap" && (
                            <div className="dashboard-card rounded-2xl border p-4 sm:p-5">
                                <Roadmap
                                    preparationPlan={interviewData.preparationPlan}
                                    completedTasks={completedTasks}
                                    toggleTask={toggleTask}
                                />
                            </div>
                        )}
                        {activeTab === "summary" && (
                            <section className="dashboard-card rounded-2xl border p-5 sm:p-6">
                                <div className="mb-5 flex items-center gap-3">
                                    <span className="dashboard-icon flex h-11 w-11 items-center justify-center rounded-xl text-[#F03260]"><ClipboardList size={21} /></span>
                                    <div>
                                        <h2 className="text-lg font-bold text-[#393436]">Report Summary</h2>
                                        <p className="mt-1 text-sm text-[#797174]">A quick overview of your preparation report.</p>
                                    </div>
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {[
                                        ["Match score", `${interviewData.matchScore}%`],
                                        ["Technical questions", interviewData.technicalQuestions.length],
                                        ["Behavioral questions", interviewData.behavioralQuestions.length],
                                        ["Preparation plan", `${interviewData.preparationPlan.length} days`],
                                    ].map(([label, value]) => (
                                        <div key={label} className="dashboard-summary-tile rounded-xl border p-4">
                                            <p className="text-xs font-medium text-[#797174]">{label}</p>
                                            <p className="mt-1 text-xl font-extrabold text-[#393436]">{value}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-5">
                                    <h3 className="mb-2 text-sm font-bold text-[#393436]">Focus areas</h3>
                                    {interviewData.skillGaps.length ? (
                                        <ul className="flex flex-wrap gap-2">
                                            {interviewData.skillGaps.map((gap, index) => <li key={gap.skill || index} className="dashboard-count-pill rounded-full px-3 py-1.5 text-xs font-medium text-[#F03260]">{gap.skill}</li>)}
                                        </ul>
                                    ) : <p className="text-sm text-[#797174]">No specific skill gaps were identified.</p>}
                                </div>
                            </section>
                        )}
                    </section>

                    {/* Right sidebar */}
                    <aside className="min-w-0 space-y-4 lg:sticky lg:top-36">
                        <section className={`${cardStyle} flex items-center gap-3 p-4`}>
                            <span className="dashboard-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[#F03260]"><Target size={21} /></span>
                            <div className="min-w-0">
                                <p className="text-xs font-semibold text-[#797174]">Target Position</p>
                                <h2 className="mt-1 truncate text-base font-bold text-[#F03260]">{interviewData.title}</h2>
                            </div>
                        </section>

                        <section className={`${cardStyle} p-4`}>
                            <div className="mb-2 flex items-center gap-3">
                                <span className="dashboard-icon flex h-9 w-9 items-center justify-center rounded-lg text-[#F03260]"><Target size={18} /></span>
                                <h2 className="text-sm font-bold text-[#393436]">Resume Match Score</h2>
                            </div>
                            <div className="flex flex-col items-center">
                                <MatchCircle score={interviewData.matchScore} />
                                <p className="dashboard-match-label mt-2 rounded-full px-3 py-1 text-xs font-semibold">Excellent Match</p>
                                <button
                                    type="button"
                                    onClick={handleDownloadResume}
                                    disabled={isDownloadingResume || !report}
                                    className="dashboard-generate-button mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isDownloadingResume ? <LoaderCircle size={17} className="animate-spin" /> : <Download size={17} />}
                                    {isDownloadingResume ? "Preparing PDF..." : "Download Tailored Resume"}
                                </button>
                            </div>
                        </section>

                        <SkillGapPanel skillGaps={interviewData.skillGaps} />

                        <div className="flex items-center gap-2 px-1 text-[11px] text-[#797174]">
                            <ClipboardCheck size={14} className="shrink-0" />
                            <span>Personalized interview report</span>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
