const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

// Resilient list of models with automatic failover
const CANDIDATE_MODELS = [
    "gemini-3.5-flash",
    "gemini-3.8-flash",
    "gemini-3.7-flash",
    "gemini-flash-latest"
]

async function generateWithFallback({ contents, schema }) {
    let lastError = null

    for (const model of CANDIDATE_MODELS) {
        try {
            console.log(`Attempting generation with model: ${model}`)
            const response = await ai.models.generateContent({
                model,
                contents,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: zodToJsonSchema(schema),
                }
            })

            if (response && response.text) {
                console.log(`Successfully generated content using model: ${model}`)
                return JSON.parse(response.text)
            }
        } catch (err) {
            console.warn(`Model ${model} failed (${err.message.slice(0, 120)}), trying next fallback...`)
            lastError = err
        }
    }

    throw new Error(`All candidate AI models failed. Last error: ${lastError ? lastError.message : "Unknown error"}`)
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

async function generatePdfFromHtml(htmlContent) {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--no-zygote",
                "--single-process"
            ]
        })
        const page = await browser.newPage()
        await page.setContent(htmlContent, { waitUntil: "networkidle0" })

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "15mm",
                bottom: "15mm",
                left: "15mm",
                right: "15mm"
            }
        })

        await browser.close()
        return pdfBuffer
    } catch (err) {
        console.warn("Puppeteer PDF generation not available on host environment, using printable HTML fallback:", err.message)
        return null
    }
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const resumePdfSchema = z.object({
        html: z.string().describe("Full standalone HTML document of the ATS resume including complete styles inside a <style> tag")
    })

    const prompt = `Generate a modern, highly professional ATS-friendly resume for a candidate with:
Resume info: ${resume || "Not provided"}
Self Description: ${selfDescription || "Not provided"}
Target Job Description: ${jobDescription || "Not provided"}

The response must be a JSON object with a single field "html" containing a full, valid HTML document (including <html>, <head>, <style>, <body>).
Design guidelines:
- Clean minimal ATS layout with black/charcoal text on pure white background
- Include Name, Contact info, Professional Summary, Skills, Experience, Education, Projects
- Tailored specifically to match the keywords and requirements of the target job description
- Single or double page print-ready format with elegant typography (Inter, Roboto or Arial)`

    const jsonContent = await generateWithFallback({
        contents: prompt,
        schema: resumePdfSchema
    })

    const rawHtml = jsonContent.html || "<p>Resume content unavailable</p>"

    const printableHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Tailored Resume</title>
<style>
@media print {
    .resume-action-bar { display: none !important; }
    body { margin: 0 !important; padding: 0 !important; background: white !important; }
}
.resume-action-bar {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    background: #0f172a;
    color: white;
    padding: 12px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: system-ui, -apple-system, sans-serif;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 9999;
}
.resume-action-btn {
    background: #4f46e5;
    color: white;
    border: 1.5px solid #000;
    border-radius: 6px;
    padding: 8px 18px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}
.resume-action-btn:hover {
    background: #4338ca;
}
</style>
</head>
<body>
<div class="resume-action-bar">
    <span><strong>Your Tailored Resume is Ready</strong> — Click Print or Save as PDF</span>
    <button class="resume-action-btn" onclick="window.print()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" width="12" height="8"></rect></svg>
        Save as PDF / Print
    </button>
</div>
${rawHtml}
<script>
window.addEventListener("load", () => {
    setTimeout(() => {
        window.print();
    }, 500);
});
</script>
</body>
</html>`

    const pdfBuffer = await generatePdfFromHtml(rawHtml)

    return {
        pdfBuffer,
        html: printableHtml
    }
}

module.exports = { generateInterviewReport, generateResumePdf }
