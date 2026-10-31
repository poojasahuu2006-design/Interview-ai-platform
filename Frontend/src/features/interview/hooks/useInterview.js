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
        setLoading(true)
        try {
            const data = await generateResumePdf({ interviewReportId })
            if (data && data.html) {
                return data.html
            }
            throw new Error("Resume content could not be generated")
        } catch (error) {
            console.error("Error generating resume:", error)
            const msg = error.response?.data?.message || error.message || "Failed to generate resume"
            throw new Error(msg)
        } finally {
            setLoading(false)
        }
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
