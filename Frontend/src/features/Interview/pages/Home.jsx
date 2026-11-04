import { useRef, useState } from "react";
import {
    ArrowRight,
    CheckCircle2,
    Copy,
    FileText,
    LoaderCircle,
    Sparkles,
    Upload,
    UserRound,
    X,
} from "lucide-react";
import { useNavigate } from "react-router";
import { createPortal } from "react-dom";
import { useInterview } from "../hooks/useInterview";
import DashboardNav from "../components/DashboardNav.jsx";
import ThemeToggle from "../../../theme/ThemeToggle.jsx";
import LogoutButton from "../../auth/components/LogoutButton.jsx";

const Home = () => {
    const { generateReport } = useInterview();
    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const [resume, setResume] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState("");
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleFile = (file) => {
        if (!file) return;
        if (file.type !== "application/pdf") {
            alert("Please upload a PDF file.");
            return;
        }
        if (file.size > 3 * 1024 * 1024) {
            alert("File size must be less than 3 MB.");
            return;
        }
        setResume(file);
    };

    const removeResume = () => {
        setResume(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const pasteExample = () => setJobDescription(
        "We are looking for a Software Developer proficient in JavaScript, React.js, Node.js, Express.js, REST APIs, MongoDB, Git, and problem-solving. The candidate should have strong communication skills and the ability to build scalable web applications."
    );

    const handleGenerateReport = async () => {
        if (isGenerating) return;
        setIsGenerating(true);
        setGenerationError("");
        try {
            const data = await generateReport({ jobDescription, selfDescription, resumeFile: resume });
            if (data?._id) navigate(`/interview/${data._id}`);
            else setGenerationError("The report could not be created. Please try again.");
        } catch (error) {
            setGenerationError(error.response?.data?.message || "The report could not be created. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setDragging(false);
        handleFile(event.dataTransfer.files?.[0]);
    };

    const handleUploadKeyDown = (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            fileInputRef.current?.click();
        }
    };

    const isFormValid = jobDescription.trim().length > 0 && selfDescription.trim().length > 0;
    const cardClass = "dashboard-card rounded-2xl border p-5 shadow-[0_12px_40px_rgba(57,52,54,0.07)] sm:p-6 lg:p-7";
    const textareaClass = "dashboard-field w-full resize-none rounded-xl border p-4 text-sm leading-6 outline-none transition placeholder:text-[#A49B9D] focus:border-[#F03260] focus:ring-2 focus:ring-[#F03260]/20";

    return (
        <main id="top" className="dashboard-main min-h-screen bg-[#F4F1F0] text-[#393436]">
            {isGenerating && createPortal(
                <div className="bg-black/70 p-4 backdrop-blur-sm" style={{ position: "fixed", inset: 0, display: "grid", placeItems: "center", zIndex: 9999 }} role="status" aria-live="polite" aria-busy="true" aria-label="Generating interview report">
                    <div className="dashboard-card flex w-full max-w-sm flex-col items-center rounded-2xl border border-[#F03260]/30 px-8 py-9 text-center shadow-2xl">
                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FCE8EC]">
                            <LoaderCircle size={42} className="animate-spin text-[#F03260]" />
                        </span>
                        <p className="mt-5 text-lg font-bold text-[#393436]">Generating your report...</p>
                        <p className="mt-2 text-sm leading-6 text-[#797174]">We’re analyzing your information and preparing your personalized interview plan.</p>
                        <span className="mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-[#FCE8EC]">
                            <span className="block h-full w-1/2 animate-pulse rounded-full bg-[#F03260]" />
                        </span>
                    </div>
                </div>,
                document.body
            )}

            <header className="dashboard-header fixed inset-x-0 top-0 z-30 backdrop-blur-xl">
                <div className="mx-auto flex h-14 max-w-[1544px] items-center justify-between px-3 sm:px-8 lg:px-10">
                    <a href="#top" className="flex shrink-0 items-center gap-2" aria-label="Interview AI home">
                        <span className="dashboard-logo-mark flex h-8 w-8 items-center justify-center rounded-xl text-white shadow-lg sm:h-9 sm:w-9"><Sparkles size={19} /></span>
                        <span className="text-sm font-bold tracking-tight text-[#393436] sm:text-xl">Interview <span className="text-[#F03260]">AI</span></span>
                    </a>
                    <div className="flex items-center gap-1 sm:gap-3">
                        <DashboardNav active="home" />
                        <ThemeToggle className="h-9 w-9 border border-[#EAE3E1] bg-white text-[#393436] sm:h-10 sm:w-10" />
                        <LogoutButton />
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-[1544px] px-5 pb-10 pt-[76px] sm:px-8 lg:px-10">
                <section className="mb-9 text-center">
                    <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#F03260]/25 bg-[#FCE8EC] px-3 py-1.5 text-xs font-semibold text-[#F03260]">
                        <Sparkles size={14} /> Your next interview starts here
                    </p>
                    <h1 className="mx-auto max-w-4xl text-3xl font-extrabold leading-tight tracking-tight text-[#393436] sm:text-4xl lg:text-[46px]">
                        AI-Powered <span className="dashboard-title-accent">Interview Preparation</span>
                    </h1>
                    <p className="mx-auto mt-3 max-w-3xl text-sm leading-6 text-[#797174] sm:text-base">
                        Get a personalized interview report from your job description, resume, and profile.
                    </p>
                </section>

                <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2 lg:gap-6">
                    <section className={`${cardClass} flex min-h-[440px] flex-col`}>
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-4">
                                <span className="dashboard-icon flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-[#F03260]"><FileText size={25} /></span>
                                <div>
                                    <h2 className="text-xl font-bold text-[#393436]">Job Description</h2>
                                    <p className="mt-1 text-sm text-[#797174]">Paste the job description for your target role.</p>
                                </div>
                            </div>
                            <button type="button" onClick={pasteExample} className="dashboard-secondary-button flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition">
                                <Copy size={14} /> Paste example
                            </button>
                        </div>
                        <div className="relative flex-1">
                            <textarea
                                value={jobDescription}
                                onChange={(event) => setJobDescription(event.target.value)}
                                maxLength={10000}
                                placeholder="e.g. Frontend Developer — responsibilities, requirements, skills..."
                                className={`${textareaClass} h-full min-h-[320px] pb-10`}
                            />
                            <span className="absolute bottom-4 right-4 text-xs text-[#A49B9D]">{jobDescription.length}/10000</span>
                        </div>
                    </section>

                    <section className={`${cardClass} flex min-h-[440px] flex-col gap-4`}>
                        <div>
                            <div className="mb-4 flex items-center gap-4">
                                <span className="dashboard-icon flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-[#F03260]"><Upload size={25} /></span>
                                <div>
                                    <h2 className="text-xl font-bold text-[#393436]">Resume</h2>
                                    <p className="mt-1 text-sm text-[#797174]">Upload a PDF resume (optional, max 3 MB).</p>
                                </div>
                            </div>
                            <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={(event) => handleFile(event.target.files?.[0])} />
                            <div
                                role="button"
                                tabIndex={0}
                                aria-label="Upload your resume PDF"
                                onKeyDown={handleUploadKeyDown}
                                onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => !resume && fileInputRef.current?.click()}
                                className={`dashboard-dropzone flex min-h-[132px] flex-col items-center justify-center rounded-2xl border border-dashed px-4 py-4 text-center outline-none transition focus-visible:ring-2 focus-visible:ring-[#F03260]/30 ${dragging ? "is-dragging" : ""} ${!resume ? "cursor-pointer" : ""}`}
                            >
                                {resume ? (
                                    <>
                                        <FileText size={25} className="mb-2 text-[#F03260]" />
                                        <p className="max-w-full break-all text-sm font-semibold text-[#393436]">{resume.name}</p>
                                        <p className="mt-1 flex items-center gap-1 text-xs text-emerald-600"><CheckCircle2 size={14} /> PDF ready · {(resume.size / (1024 * 1024)).toFixed(2)} MB</p>
                                        <button type="button" onClick={(event) => { event.stopPropagation(); removeResume(); }} className="mt-2 flex items-center gap-1 text-xs font-semibold text-[#F03260] hover:underline"><X size={13} /> Remove file</button>
                                    </>
                                ) : (
                                    <>
                                        <Upload size={27} className="mb-2 text-[#F03260]" />
                                        <p className="text-sm font-semibold text-[#393436]">Click to upload or drag and drop</p>
                                        <p className="mt-1 text-xs text-[#797174]">PDF · Maximum 3 MB</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-1 flex-col">
                            <div className="mb-3 flex items-center gap-4">
                                <span className="dashboard-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-[#F03260]"><UserRound size={23} /></span>
                                <div>
                                    <h2 className="text-lg font-bold text-[#393436]">Self Description</h2>
                                    <p className="mt-0.5 text-sm text-[#797174]">Tell us about your skills, projects, experience, and goals.</p>
                                </div>
                            </div>
                            <div className="relative flex-1">
                                <textarea
                                    value={selfDescription}
                                    onChange={(event) => setSelfDescription(event.target.value)}
                                    maxLength={2000}
                                    placeholder="e.g. I'm a full-stack developer with experience in React, Node.js..."
                                    className={`${textareaClass} h-full min-h-[125px] pb-10`}
                                />
                                <span className="absolute bottom-4 right-4 text-xs text-[#A49B9D]">{selfDescription.length}/2000</span>
                            </div>
                        </div>
                    </section>
                </div>

                <section className="mt-7 flex flex-col items-center">
                    {generationError && <p role="alert" aria-live="assertive" className="mb-4 w-full max-w-[530px] rounded-xl border border-[#e9a4b2] bg-[#fff0f3] px-4 py-3 text-sm font-medium text-[#b42348]">{generationError}</p>}
                    <button type="button" onClick={handleGenerateReport} disabled={!isFormValid || isGenerating} className="dashboard-generate-button flex min-h-[62px] w-full max-w-[530px] items-center justify-center gap-3 rounded-2xl px-6 py-4 text-base font-bold text-white transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:text-lg">
                        <Sparkles size={21} /> Generate Interview Report <ArrowRight size={21} />
                    </button>
                    <p className="mt-3 flex items-center gap-2 text-xs text-[#797174]"><Sparkles size={13} className="text-[#F03260]" /> AI insights tailored to your next interview.</p>
                </section>

                <footer className="pb-2 pt-10 text-center text-xs text-[#A49B9D]">
                    Interview AI · Prepare smarter · Interview better
                </footer>
            </div>
        </main>
    );
};

export default Home;
