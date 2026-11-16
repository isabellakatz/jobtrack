import type {
  JobApplication,
  JobApplicationCreate,
  JobApplicationUpdate
} from "../types/application"

const API_URL = "http://127.0.0.1:8000"

export async function getApplications(
  accessToken: string
): Promise<JobApplication[]> {

  const response = await fetch(
    `${API_URL}/applications`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!response.ok) {
    const errorText = await response.text()

    throw new Error(
      `Failed to fetch applications: ${response.status} ${errorText}`
    )
  }

  return response.json()
}

export async function createApplication(
  application: JobApplicationCreate,
  accessToken: string
): Promise<JobApplication> {

  const response = await fetch(`${API_URL}/applications`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },

    body: JSON.stringify(application),
  })

  if (!response.ok) {
    throw new Error("Failed to create application")
  }

  return response.json()
}

// React sends a PATCH request to the backend to update an existing job application with the specified applicationId and updates.
export async function updateApplication(
  applicationId: number,
  updates: JobApplicationUpdate,
  accessToken: string
): Promise<JobApplication> {

  const response = await fetch(
    `${API_URL}/applications/${applicationId}`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },

      body: JSON.stringify(updates),
    }
  )

  if (!response.ok) {
    throw new Error("Failed to update application")
  }

  return response.json()
}

// Delete a job application with the specified applicationId.
export async function deleteApplication(
  applicationId: number,
  accessToken: string
): Promise<void> {
  const response = await fetch(
    `${API_URL}/applications/${applicationId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error("Failed to delete application")
  }
}