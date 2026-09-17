import type { JobApplication } from "../types/application"

const API_URL = "http://127.0.0.1:8000"

export async function getApplications(): Promise<JobApplication[]> {
  const response = await fetch(`${API_URL}/applications`)

  if (!response.ok) {
    throw new Error("Failed to fetch applications")
  }

  return response.json()
}