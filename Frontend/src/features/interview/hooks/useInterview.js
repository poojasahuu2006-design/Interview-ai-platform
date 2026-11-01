import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"

export const useInterview = () => {
    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        let response = null
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
        } catch (error) {
            console.error("Error generating report:", error)
            const msg = error.response?.data?.message || error.message || "Failed to generate report"
            throw new Error(msg)
        } finally {
            setLoading(false)
        }
        return response?.interviewReport
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (error) {
            console.error("Error fetching report:", error)
        } finally {
            setLoading(false)
        }
        return response?.interviewReport
    }

    const getReports = async () => {
        setLoading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
        } catch (error) {
            console.error("Error fetching reports:", error)
        } finally {
            setLoading(false)
        }
        return response?.interviewReports
    }

    const getResumePdf = async (interviewReportId) => {
        const data = await generateResumePdf({ interviewReportId })
        if (!data || !data.html) {
            throw new Error("Resume content could not be generated")
        }

        const resumeHtml = data.html
        const sanitizedHtml = resumeHtml.replace(/<title[\s\S]*?<\/title>/gi, "")

        // Open native Save-as-PDF print dialog for immediate clean 1-2 page PDF export
        const printFrame = document.createElement("iframe")
        printFrame.style.position = "fixed"
        printFrame.style.right = "0"
        printFrame.style.bottom = "0"
        printFrame.style.width = "0"
        printFrame.style.height = "0"
        printFrame.style.border = "0"
        document.body.appendChild(printFrame)

        const prevTitle = document.title
        document.title = "" // Suppress window title from browser print headers

        printFrame.contentWindow.document.open()
        printFrame.contentWindow.document.write(sanitizedHtml)
        printFrame.contentWindow.document.title = ""
        if (printFrame.contentDocument) {
            printFrame.contentDocument.title = ""
        }
        printFrame.contentWindow.document.close()

        setTimeout(() => {
            try {
                printFrame.contentWindow.focus()
                printFrame.contentWindow.print()
            } catch (e) {
                console.warn("Print dialog closed or bypassed:", e)
            } finally {
                document.title = prevTitle || "Interview AI"
                setTimeout(() => {
                    if (document.body.contains(printFrame)) {
                        document.body.removeChild(printFrame)
                    }
                }, 3000)
            }
        }, 500)
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [ interviewId ])

    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf }
}
