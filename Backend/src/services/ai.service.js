const {GoogleGenAI} = require('@google/genai')
const {z} = require('zod')
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")


const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})


async function generateInterviewReport({ resume, selfDescription, jobDescription }) {


    const prompt = `Generate a complete, specific interview preparation report for a candidate with the following details. Fill every field in the required JSON schema. Include a match score from 0 to 100, at least 5 technical questions, at least 5 behavioral questions, any relevant skill gaps, and a practical 7-day preparation plan. Include the job title in the title field, deriving it from the job description. If no resume was provided, base the report on the self description and job description, and do not invent candidate experience or skills:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
`

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: z.toJSONSchema(interviewReportSchema),
        }
    })

    let report
    try {
        report = JSON.parse(response.text)
    } catch (error) {
        throw new Error(`Gemini returned invalid JSON: ${error.message}`)
    }

    const parsedReport = interviewReportSchema.safeParse(report)
    if (!parsedReport.success) {
        throw new Error(`Gemini response did not match the report schema: ${parsedReport.error.message}`)
    }

    const result = parsedReport.data
    const emptySections = [
        'technicalQuestions',
        'behavioralQuestions',
        'preparationPlan'
    ].filter((field) => result[field].length === 0)

    if (emptySections.length > 0) {
        throw new Error(`Gemini returned empty report sections: ${emptySections.join(', ')}`)
    }

    return result


}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "15mm",
            bottom: "15mm",
            left: "10mm",
            right: "10mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        The format of resume should be clean and minimalistic, with clear headings and sections for easy navigation. Use bullet points to highlight key achievements and skills, and ensure that the font size and style are professional and easy to read.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                        Attach the link in linkedin profile and github profile if available in the resume. If not available, then simply use site links of linkedin and github in the resume and make them open in new tab when clicked.
                        Keep the name at center of the resume and make it bold and slightly bigger than the rest of the content. Use a professional font like Arial, Helvetica, or Times New Roman for the entire resume. Avoid using fancy fonts or colors that can distract from the content. Maintain consistency in font size and style throughout the resume, and use bold or italics sparingly to emphasize important information. Ensure that the resume is visually appealing and easy to read, with appropriate spacing and alignment of text and sections.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })


    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}



module.exports = { generateInterviewReport, generateResumePdf }
