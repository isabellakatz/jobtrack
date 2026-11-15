export interface RegisterData {
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export interface User {
  id: number
  email: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}