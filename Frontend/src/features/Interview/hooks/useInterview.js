import { getAllInterviewReports, generateInterviewReport, getInterviewReportById } from "../services/interview.api"
import { useCallback, useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"
import { useAuth } from "../../auth/hooks/useAuth"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()
    const { user } = useAuth()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reportError, setReportError, reports, setReports, reportsError, setReportsError } = context

    const generateReport = useCallback(async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        setReportError(null)
        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
            return response?.interviewReport ?? null
        } finally {
            setLoading(false)
        }
    }, [setLoading, setReport, setReportError])

    const getReportById = useCallback(async (reportId) => {
        setLoading(true)
        setReport(null)
        setReportError(null)
        try {
            const response = await getInterviewReportById(reportId)
            setReport(response.interviewReport)
            return response?.interviewReport ?? null
        } catch (error) {
            setReportError(error.response?.data?.message || "Could not load this report. Please try again.")
            return null
        } finally {
            setLoading(false)
        }
    }, [setLoading, setReport, setReportError])

    const getReports = useCallback(async () => {
        setLoading(true)
        setReportsError(null)
        try {
            const response = await getAllInterviewReports()
            const interviewReports = Array.isArray(response?.interviewReports) ? response.interviewReports : []
            setReports(interviewReports)
            return interviewReports
        } catch (error) {
            console.log(error)
            setReports([])
            setReportsError(error.response?.data?.message || "Couldn't load reports. Check your connection and try again.")
            return []
        } finally {
            setLoading(false)
        }
    }, [setLoading, setReports, setReportsError])

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else if (user?.isGuest) {
            setReports([])
            setReportsError(null)
            setLoading(false)
        } else {
            getReports()
        }
    }, [interviewId, user?.id, user?.isGuest, getReportById, getReports, setLoading, setReports, setReportsError])

    return { loading, report, reportError, reports, reportsError, generateReport, getReportById, getReports }

}
