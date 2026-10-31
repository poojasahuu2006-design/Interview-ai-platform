const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

// Highly available models to prevent 503 capacity spikes
const CANDIDATE_MODELS = [
    "gemini-2.5-flash-lite",
    "gemini-3.5-flash-lite",
    "gemini-flash-lite-latest",
    "gemini-3.5-flash",
    "gemini-3.8-flash"
]

async function generateWithFallback({ contents, schema }) {
    let lastError = null

    for (const model of CANDIDATE_MODELS) {
        try {
            console.log(`Generating content with model: ${model}`)
            const response = await ai.models.generateContent({
                model,
                contents,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: zodToJsonSchema(schema),
                }
            })

            if (response && response.text) {
                console.log(`Successfully generated content using: ${model}`)
                return JSON.parse(response.text)
            }
        } catch (err) {
            console.warn(`Model ${model} failed (${err.message.slice(0, 100)}), falling back...`)
            lastError = err
        }
    }

    throw new Error(`All candidate AI models failed: ${lastError ? lastError.message : "Unknown error"}`)
}

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate profile matches the job description"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap")
    })).describe("List of skill gaps in the candidate profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan"),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day")
    })).describe("A day-wise preparation plan"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume || "Not provided"}
                        Self Description: ${selfDescription || "Not provided"}
                        Job Description: ${jobDescription || "Not provided"}
`
    return await generateWithFallback({
        contents: prompt,
        schema: interviewReportSchema
    })
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate a high-impact, ATS-friendly resume for a candidate with:
                        Resume: ${resume || "Not provided"}
                        Self Description: ${selfDescription || "Not provided"}
                        Job Description: ${jobDescription || "Not provided"}

                        CRITICAL STRICT REQUIREMENTS:
                        1. LENGTH: Strictly 1 to 2 pages maximum (ideally 1 to 2 pages). Keep descriptions concise, punchy, and relevant to the target job description. Never exceed 2 pages.
                        2. FORMAT: Pure semantic HTML (h1, h2, h3, h4, p, ul, li). No decorative fluff.
                        3. ATS COMPLIANCE: Standard headers: Professional Summary, Core Competencies / Technical Skills, Professional Experience, Education, Notable Projects.
                        4. TONE: Human-written, professional, action-oriented bullet points starting with strong action verbs.
                        5. OUTPUT: A single JSON object with field "html" containing the resume body content.
                    `

    const jsonContent = await generateWithFallback({
        contents: prompt,
        schema: resumePdfSchema
    })

    const rawHtml = jsonContent.html || "<p>Resume content generated.</p>"

    // Strict 1-2 page layout with @page margin: 0 to remove browser date/header/footer stamps
    const printOptimizedHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title></title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

@page {
    size: A4;
    margin: 0mm; /* Eliminates browser default header (date/time) and footer (URL) */
}

* {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
}

html, body {
    margin: 0;
    padding: 0;
    background: #ffffff;
    color: #0f172a;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 12px;
    line-height: 1.45;
}

body {
    padding: 14mm 16mm;
    max-width: 800px;
    margin: 0 auto;
}

h1 {
    font-size: 22px;
    font-weight: 700;
    margin: 0 0 3px 0;
    color: #0f172a;
    letter-spacing: -0.01em;
}

h2 {
    font-size: 13px;
    font-weight: 600;
    color: #4f46e5;
    margin: 0 0 10px 0;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

h3 {
    font-size: 12.5px;
    font-weight: 700;
    border-bottom: 1px solid #0f172a;
    padding-bottom: 2px;
    margin: 14px 0 6px 0;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: #0f172a;
    break-after: avoid;
    page-break-after: avoid;
}

h4 {
    font-size: 12px;
    font-weight: 600;
    margin: 8px 0 2px 0;
    color: #1e293b;
    break-after: avoid;
    page-break-after: avoid;
}

p {
    font-size: 11.5px;
    color: #334155;
    margin: 2px 0 4px 0;
}

ul {
    padding-left: 16px;
    margin: 3px 0 6px 0;
}

li {
    font-size: 11.5px;
    color: #334155;
    margin-bottom: 2px;
}

ul, p, li {
    break-inside: avoid;
    page-break-inside: avoid;
}

@media print {
    body {
        padding: 12mm 14mm !important;
        max-width: 100% !important;
    }
}
</style>
</head>
<body>
${rawHtml}
</body>
</html>`

    return {
        html: printOptimizedHtml
    }
}

module.exports = { generateInterviewReport, generateResumePdf }
