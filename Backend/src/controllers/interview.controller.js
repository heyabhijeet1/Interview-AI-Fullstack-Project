const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

function respondToAiServiceError(res, error, action) {
    const status = Number(error.status || error.statusCode)
    const errorDetails = `${error.message || ""} ${error.error?.status || ""}`
    const quotaExceeded = status === 429 || /RESOURCE_EXHAUSTED|quota exceeded|daily quota/i.test(errorDetails)

    if (quotaExceeded) {
        return res.status(429).json({
            message: `The AI service has reached its current usage limit, so we can't ${action} right now. Please try again after the limit resets.`
        })
    }

    if (status === 503 || status === 502) {
        return res.status(503).json({
            message: `The AI service is temporarily unavailable, so we can't ${action} right now. Please try again in a few minutes.`
        })
    }

    return null
}



/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {

    const { selfDescription, jobDescription } = req.body
    let resumeText = "No resume provided."

    if (req.file) {
        const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
        resumeText = resumeContent.text
    }

    let interViewReportByAi
    try {
        interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        })
    } catch (error) {
        const response = respondToAiServiceError(res, error, "generate your report")
        if (response) return response
        throw error
    }

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        ...(req.user.isGuest ? { guestExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) } : {}),
        resume: resumeText,
        selfDescription,
        jobDescription,
        ...interViewReportByAi
    })

    res.status(201).json({
        message: "Interview report generated successfully.",
        interviewReport
    })

}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    if (req.user.isGuest) {
        return res.status(403).json({
            message: "Create an account to access your reports. Your guest reports will be available after signup."
        })
    }

    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findOne({
        _id: interviewReportId,
        user: req.user.id
    })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    let pdfBuffer
    try {
        pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })
    } catch (error) {
        const response = respondToAiServiceError(res, error, "generate your tailored resume PDF")
        if (response) return response
        throw error
    }

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }
