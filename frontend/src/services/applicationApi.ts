import type {
JobApplication,
JobApplicationCreate,
JobApplicationUpdate
} from "../types/application"

const API_URL = "http://127.0.0.1:8000"

export async function getApplications(): Promise<JobApplication[]> {
  const response = await fetch(`${API_URL}/applications`)

  if (!response.ok) {
    throw new Error("Failed to fetch applications")
  }

  return response.json()
}

export async function createApplication(
  application: JobApplicationCreate
): Promise<JobApplication> {
    // fetch() = uses GET method by default to retrieve data from the backend.
  const response = await fetch(`${API_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // converts the JavaScript object application into a JSON string to be sent in the HTTP-request body to the backend.
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
  updates: JobApplicationUpdate
): Promise<JobApplication> {
  const response = await fetch(
    `${API_URL}/applications/${applicationId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
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
  applicationId: number
): Promise<void> {
    const response = await fetch(
        `${API_URL}/applications/${applicationId}`,
        {
            method: "DELETE",
        }
    )

    if (!response.ok) {
        throw new Error("Failed to delete application")
    }
}