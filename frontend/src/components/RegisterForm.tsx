import { useState } from "react"
import { registerUser } from "../services/authApi"

interface RegisterFormProps {
  onShowLogin: () => void
}

function RegisterForm({
  onShowLogin
}: RegisterFormProps) {

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    try {
      setIsSubmitting(true)

      await registerUser({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      })

      onShowLogin()

    } catch (error) {
      console.error("Registration failed:", error)
      setError("Could not create account.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login-page">
      <div className="login-content">

        <div className="login-intro">
          <h1 className="typing-title">
            Create your JobTrack account
          </h1>

          <p>
            Start tracking your applications in one place.
          </p>
        </div>

        <div className="login-card">
          <h2>Create account</h2>

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            <div className="login-field">
              <label>First name</label>

              <input
                type="text"
                required
                value={firstName}
                onChange={(event) =>
                  setFirstName(event.target.value)
                }
              />
            </div>

            <div className="login-field">
              <label>Last name</label>

              <input
                type="text"
                required
                value={lastName}
                onChange={(event) =>
                  setLastName(event.target.value)
                }
              />
            </div>

            <div className="login-field">
              <label>Email</label>

              <input
                type="email"
                required
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
              />
            </div>

            <div className="login-field">
              <label>Password</label>

              <input
                type="password"
                required
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
              />
            </div>

            <div className="login-field">
              <label>Confirm password</label>

              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
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
              {isSubmitting
                ? "Creating account..."
                : "Create account"}
            </button>

          </form>

          <div className="login-register">
            <span>Already have an account?</span>

            <button
              type="button"
              className="auth-link"
              onClick={onShowLogin}
            >
              Log in
            </button>
          </div>

        </div>
      </div>
    </main>
  )
}

export default RegisterForm