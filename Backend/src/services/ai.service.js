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

                        HARD STRICT LENGTH RULES:
                        - TOTAL LENGTH MUST BE STRICTLY MAXIMUM 2 PAGES (NEVER 3 PAGES).
                        - Total word count should be around 350-450 words max to comfortably fit within 2 pages without overflowing.
                        - Concise, punchy bullet points (max 2-3 bullets per project/experience, max 1 line per bullet).
                        - Header centered: Candidate Name (h1), Target Title (h2), Contact info in one line (Email | Phone | LinkedIn | GitHub | Location).
                        - Standard ATS uppercase sections (h3): SUMMARY, SKILLS, EXPERIENCE, PROJECTS, EDUCATION.
                        - No unnecessary filler or overly long paragraphs.
                    `

    const jsonContent = await generateWithFallback({
        contents: prompt,
        schema: resumePdfSchema
    })

    const rawHtml = jsonContent.html || "<p>Resume content generated.</p>"

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
    margin: 10mm 14mm 10mm 14mm; /* Compact margins ensuring strict 1-2 page fit */
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
    font-size: 11px;
    line-height: 1.38;
}

body {
    max-width: 800px;
    margin: 0 auto;
}

/* Center Candidate Name & Contact Info */
h1 {
    text-align: center;
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 2px 0;
    color: #0f172a;
    letter-spacing: -0.01em;
}

h2 {
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    color: #4f46e5;
    margin: 0 0 6px 0;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

/* Contact info paragraph centered */
h1 + p, h2 + p, header p, .contact-info, h1 ~ ul:first-of-type {
    text-align: center;
    justify-content: center;
    font-size: 10.5px;
    color: #475569;
    margin: 0 0 10px 0;
}

/* Section Headings */
h3 {
    font-size: 11.5px;
    font-weight: 700;
    border-bottom: 1px solid #0f172a;
    padding-bottom: 2px;
    margin: 10px 0 4px 0;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: #0f172a;
    break-after: avoid-page !important;
    page-break-after: avoid !important;
}

h4 {
    font-size: 11px;
    font-weight: 600;
    margin: 6px 0 1px 0;
    color: #1e293b;
    break-after: avoid-page !important;
    page-break-after: avoid !important;
}

p {
    font-size: 10.5px;
    color: #334155;
    margin: 2px 0 3px 0;
}

ul {
    padding-left: 14px;
    margin: 2px 0 4px 0;
}

li {
    font-size: 10.5px;
    color: #334155;
    margin-bottom: 2px;
}

ul, p, li {
    break-inside: avoid;
    page-break-inside: avoid;
}

@media print {
    body {
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
