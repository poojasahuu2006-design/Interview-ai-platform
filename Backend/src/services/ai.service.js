const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

// High-capacity models that prevent 503 spikes
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
            console.warn(`Model ${model} failed (${err.message.slice(0, 100)}), trying next model...`)
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
Job Description: ${jobDescription || "Not provided"}`

    return await generateWithFallback({
        contents: prompt,
        schema: interviewReportSchema
    })
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const resumePdfSchema = z.object({
        html: z.string().describe("Full standalone HTML resume body content including headers, sections, bullet points, skills, experience")
    })

    const prompt = `Generate a modern, highly professional ATS-friendly resume for a candidate with:
Candidate Profile: ${resume || selfDescription || "Experienced Professional"}
Target Job Description: ${jobDescription || "Relevant Professional Position"}

Requirements:
- Pure clean semantic HTML (h1, h2, h3, h4, p, ul, li)
- Include Name, Contact Info, Professional Summary, Core Skills, Work Experience, Projects, Education
- Tailored specifically to pass ATS scans for this job description
- Return valid clean HTML`

    const jsonContent = await generateWithFallback({
        contents: prompt,
        schema: resumePdfSchema
    })

    const bodyHtml = jsonContent.html || "<p>Resume content generated.</p>"

    const fullStyledHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Tailored ATS Resume</title>
<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
* { box-sizing: border-box; }
body {
    font-family: "Inter", system-ui, -apple-system, sans-serif;
    color: #0f172a;
    background: #ffffff;
    max-width: 820px;
    margin: 0 auto;
    padding: 36px 40px;
    line-height: 1.6;
}
h1 { font-size: 26px; font-weight: 700; margin: 0 0 6px 0; color: #0f172a; letter-spacing: -0.02em; }
h2 { font-size: 15px; font-weight: 600; color: #4f46e5; margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: 0.05em; }
h3 { font-size: 14px; font-weight: 700; border-bottom: 1.5px solid #000000; padding-bottom: 4px; margin: 22px 0 10px 0; text-transform: uppercase; letter-spacing: 0.03em; color: #0f172a; }
h4 { font-size: 14px; font-weight: 600; margin: 12px 0 4px 0; color: #1e293b; }
p, li { font-size: 13.5px; color: #334155; margin: 4px 0; }
ul { padding-left: 20px; margin: 6px 0 12px 0; }
li { margin-bottom: 4px; }
a { color: #4f46e5; text-decoration: none; }
@media print {
    body { padding: 0 !important; max-width: 100% !important; }
}
</style>
</head>
<body>
${bodyHtml}
</body>
</html>`

    return {
        html: fullStyledHtml
    }
}

module.exports = { generateInterviewReport, generateResumePdf }
