import axios from "axios";

// Set VITE_API_URL to the backend's public URL for deployments. In local
// development, use the current hostname so LAN devices can reach the backend.
const apiBaseURL = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, "") ||
    (import.meta.env.DEV ? `http://${window.location.hostname}:3000` : window.location.origin);

const api = axios.create({
    baseURL: apiBaseURL,
    withCredentials: true,
})


/**
 * @description Service to generate interview report based on user self description, resume and job description.
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {

    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)
    if (resumeFile) {
        formData.append("resume", resumeFile)
    }

    const response = await api.post("/api/interview/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })

    return response.data

}


/**
 * @description Service to get interview report by interviewId.
 */
export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`)

    return response.data
}


/**
 * @description Service to get all interview reports of logged in user.
 */
export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/")

    return response.data
}

export const downloadResumePdf = async (interviewReportId) => {
    const response = await api.post(
        `/api/interview/resume/pdf/${interviewReportId}`,
        {},
        { responseType: "blob" }
    )

    return response.data
}
