import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React from "react"

const Protected = ({children}) => {
    const { loading, user } = useAuth()

    if (loading) {
        return (
            <div className="loading-screen" style={{
                minHeight: "100vh",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(180deg, #f1f5f9 0%, #f8fafc 100%)"
            }}>
                <div style={{
                    background: "#ffffff",
                    border: "1.5px solid #000000",
                    borderRadius: "0.85rem",
                    padding: "2.5rem 2rem",
                    maxWidth: "440px",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    gap: "1rem",
                    boxShadow: "0 10px 25px -5px rgba(15,23,42,0.08)"
                }}>
                    <div style={{
                        width: "44px",
                        height: "44px",
                        border: "3.5px solid #e2e8f0",
                        borderTopColor: "#4f46e5",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite"
                    }} />
                    <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>Loading...</h2>
                    <p style={{ fontSize: "0.875rem", color: "#64748b", margin: 0 }}>Verifying your session</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to={"/login"} />
    }

    return children
}

export default Protected
