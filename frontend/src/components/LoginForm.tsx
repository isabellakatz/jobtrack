import { useState } from "react"
import { loginUser } from "../services/authApi"

/* Callback from  App.tsx to recieve JWT token */
interface LoginFormProps {
    onLogin: (accessToken: string) => void
}

function LoginForm({ onLogin }: LoginFormProps) {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault()

        setError("")
        setIsSubmitting(true)

        try {
            const tokenResponse = await loginUser({
                email,
                password,
            })

            onLogin(tokenResponse.access_token)
        } catch (error) {
            console.error("Login failed:", error)
            setError("Invalid email or password.")
        } finally {
            setIsSubmitting(false)
        }
    }
    return (
        <main className="login-page">
            <div className="login-content">

                
                <section className="auth-form-container">
                    <h2>Log in</h2>

                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="auth-form-field">
                            <label htmlFor="login-email">
                                Email
                            </label>

                            <input
                                id="login-email"
                                type="email"
                                required
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                            />
                        </div>

                        <div className="auth-form-field">
                            <label htmlFor="login-password">
                                Password
                            </label>

                            <input
                                id="login-password"
                                type="password"
                                required
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                            />
                        </div>

                        {error && (
                            <p className="auth-error">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Logging in..." : "Log in"}
                        </button>
                    </form>
                </section>
            </div>
        </main>
    )
}


export default LoginForm