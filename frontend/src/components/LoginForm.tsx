import { useState } from "react"
import { loginUser } from "../services/authApi"

/* Callback from  App.tsx to recieve JWT token */
interface LoginFormProps {
    onLogin: (accessToken: string) => void
    onShowRegister: () => void
}

function LoginForm({ onLogin, onShowRegister }: LoginFormProps) {

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

      <div className="login-intro">
        <h1 className="typing-title">
          Welcome to JobTrack
        </h1>

        <p>
          Keep track of your applications, interviews and opportunities.
        </p>
      </div>

      <div className="login-card">
        <h2>Log in</h2>

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <div className="login-field">
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
              placeholder="you@example.com"
            />
          </div>

          <div className="login-field">
            <div className="login-password-label">
              <label htmlFor="login-password">
                Password
              </label>

              <button
                type="button"
                className="auth-link"
              >
                Forgot password?
              </button>
            </div>

            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <button
            className="login-submit-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="login-register">
          <span>Don't have an account?</span>

          <button
            type="button"
            className="auth-link"
            onClick={onShowRegister}
          >
            Create account
          </button>
        </div>
      </div>

    </div>
  </main>
)
}


export default LoginForm