import React, { useState } from "react"
import { useNavigate, Link } from "react-router"
import "../auth.form.scss"
import { useAuth } from "../hooks/useAuth"

const Register = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const { loading, handleRegister } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        const res = await handleRegister({ username, email, password })
        if (res?.success) {
            navigate("/")
        } else {
            setError(res?.message || "Registration failed. Account may already exist.")
        }
    }

    if (loading) {
        return (
            <main className="auth-page">
                <h1>Loading...</h1>
            </main>
        )
    }

    return (
        <main className="auth-page">
            <div className="form-container">
                <h1>Register</h1>

                {error && (
                    <div style={{
                        backgroundColor: "#fee2e2",
                        border: "1.5px solid #ef4444",
                        color: "#991b1b",
                        padding: "0.75rem 1rem",
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
                        marginBottom: "1rem"
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter username"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter email address"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter password"
                        />
                    </div>

                    <button className="button primary-button" type="submit">Register</button>
                </form>

                <p className="auth-footer">Already have an account? <Link to={"/login"}>Login</Link></p>
            </div>
        </main>
    )
}

export default Register
