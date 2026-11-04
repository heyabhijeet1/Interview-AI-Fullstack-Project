import { useState } from "react";
import { InterviewContext } from "./interview.context";

export const InterviewProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const [report, setReport] = useState(null)
    const [reportError, setReportError] = useState(null)
    const [reports, setReports] = useState([])
    const [reportsError, setReportsError] = useState(null)

    return (
        <InterviewContext.Provider value={{ loading, setLoading, report, setReport, reportError, setReportError, reports, setReports, reportsError, setReportsError }}>
            {children}
        </InterviewContext.Provider>
    )
}
