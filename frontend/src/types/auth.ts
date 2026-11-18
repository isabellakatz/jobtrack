export interface User {
  id: number
  first_name: string | null
  last_name: string | null
  email: string
}

export interface RegisterData {
  first_name: string
  last_name: string
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