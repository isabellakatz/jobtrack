import type {
  LoginData,
  RegisterData,
  TokenResponse,
  User,
} from "../types/auth"

const API_URL = "http://127.0.0.1:8000"

export async function getCurrentUser(
  accessToken: string
): Promise<User> {

  const response = await fetch(
    `${API_URL}/auth/me`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error("Failed to load user")
  }

  return response.json()
}

export async function registerUser(
  userData: RegisterData
): Promise<User> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Failed to register: ${response.status} ${errorText}`
    )
  }

  return response.json()
}

export async function loginUser(
  loginData: LoginData
): Promise<TokenResponse> {

  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(loginData),
    }
  )

  if (!response.ok) {
    const errorText = await response.text()

    throw new Error(
      `Login failed: ${response.status} ${errorText}`
    )
  }

  return response.json()
}