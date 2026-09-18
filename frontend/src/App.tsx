import { useEffect, useState } from "react"

import ApplicationForm from "./components/ApplicationForm"

import {
  createApplication,
  deleteApplication,
  getApplications,
  updateApplication
} from "./services/applicationApi"

import type {
  ApplicationStatus,
  JobApplication,
  JobApplicationCreate,
} from "./types/application"

import "./App.css"


function App() {
  // 1. STATE
  //The App component is the main component of the application. It fetches job applications from the backend and displays them in a list.
  const [applications, setApplications] = 
  useState<JobApplication[]>([])
  
  const [loading, setLoading] = 
  useState(true)
  
  const [error, setError] = 
  useState<string | null>(null)

  // selectedApplication = keeps track of the currently selected job application.
  const [selectedApplicationId, setSelectedApplicationId] =
  useState<number | null>(null)

  // editStatus = separate form to edit the status of a selected job application.
  const [editStatus, setEditStatus] = 
  useState<ApplicationStatus>("saved")
  
    // editNotes = separate form to edit the notes of a selected job application.
  const [editNotes, setEditNotes] = useState("")

  // 2. LOAD APPLICATIONS WHEN APP STARTS
  // The useEffect hook runs the code when the component loads for the first time. 
  // It fetches the job applications from the backend and sets the state accordingly.
  useEffect(() => {
    async function loadApplications() {
      try {
        // getApplications() = Fetch applications from the backend
        const data = await getApplications()
        setApplications(data)
      } catch {
        // If there was an error fetching the applications, set the error state to display an error message.
        setError("Could not load applications.")
      } finally {
        setLoading(false)
      }
    }

    loadApplications()
  }, [])

  // 3. FIND CURRENTLY SELECTED APPLICATION
  const selectedApplication =
    applications.find((application) => application.id === selectedApplicationId) ?? null

    // 4. LOAD SELECTED APPLICATION DETAILS INTO EDIT FIELDS
    useEffect(() => {
      if (selectedApplication) {
        setEditStatus(selectedApplication.status)
        setEditNotes(selectedApplication.notes ?? "")
      }
    }, [selectedApplication])

    // 5. CREATE A NEW APPLICATION - Is handled by the ApplicationForm component, which is a child of the App component. 
    // The onCreate prop is passed to the ApplicationForm component, which calls the handleCreateApplication function when the form is submitted.
async function handleCreateApplication(applicationData: JobApplicationCreate) {
  try {
    setError(null)

    const newApplication = await createApplication(applicationData)

    setApplications((currentApplications) => [
      newApplication,
      ...currentApplications,
    ])

    setSelectedApplicationId(newApplication.id)
  } catch {
    setError("Could not create application.")
  }
}

// 6. UPDATE AN EXISTING APPLICATION
async function handleUpdate() {
  // if no application is selected = nothing to update, so return early from the function.
  if (!selectedApplication) {
    return
  }

  try {
    setError(null)

    // updateApplication() = Send a PATCH request to the backend to update the selected job application 
    // with the new status and notes.
    const updatedApplication = await updateApplication(
      selectedApplication.id,
      {
        status: editStatus,
        notes: editNotes || null,
      }
    )

    // .map() = Iterate over the current list of applications and replace the updated application with the new data.
    setApplications((currentApplications) =>
      currentApplications.map((application) =>
        application.id === updatedApplication.id
          ? updatedApplication
          : application
      )
    )
  } catch {
    setError("Could not update application.")
  }
}

  // 8. DELETE AN APPLICATION
  async function handleDelete() {
  if (!selectedApplication) {
    return
  }

  // window.confirm() = Show a confirmation dialog to the user before deleting the application.
  const confirmed = window.confirm(
    `Are you sure you want to delete ${selectedApplication.company} - ${selectedApplication.job_title}?`
  )

  // The user clicked "Cancel" in the confirmation dialog, so return early from the function.
  if (!confirmed) {
    return
  }

  try {
    setError(null)

    // Sends DELETE-request to the backend (FastAPI) to delete the selected job application.
    await deleteApplication(selectedApplication.id)

    // Update the React state to remove the deleted application from the list and clear the selected application.
    setApplications((currentApplications) =>
      currentApplications.filter(
        (application) => application.id !== selectedApplication.id
      )
    )

    setSelectedApplicationId(null)
  } catch {
    setError("Could not delete application.")
  }
}

  //9. EARLY RETURNS
  // Still waiting for the applications to load, show a loading message. If there was an error, show the error message. Otherwise, display the list of applications.
  if (loading) {
    return <p>Loading applications...</p>
  }


  if (error) {
    return <p>{error}</p>
  }

  return (
    <main>
      <h1>JobTrack</h1>
      <p>Track your job applications in one place.</p>

      <ApplicationForm onCreate={handleCreateApplication}/>
         
      <h2>Applications</h2>

      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <ul>
          {applications.map((application) => (
            <li key={application.id}>
              <button
                type="button"
                onClick={() => setSelectedApplicationId(application.id)}
              >
                <strong>{application.company}</strong>
                {" — "}
                {application.job_title}
                {" — "}
                {application.status}
            </button>
        </li>
      ))}
  </ul>
  )}
  
  <section>
    <h2>Application details</h2>

    {selectedApplication ? (
      <div>
        <h3>{selectedApplication.company}</h3>
        <p>
          <strong>Role:</strong> {selectedApplication.job_title}
        </p>

        <p>
          <strong>Location:</strong>{" "}
        {selectedApplication.location || "Not specified"}
        </p>

        <div>
          <label htmlFor="edit-status">
          <strong>Status:</strong>
        </label>

        <select
          id="edit-status"
          value={editStatus}
          onChange={(event) =>
            setEditStatus(event.target.value as ApplicationStatus)
          }
        >
        <option value="saved">Saved</option>
        <option value="applied">Applied</option>
        <option value="screening">Screening</option>
        <option value="interview">Interview</option>
        <option value="offer">Offer</option>
        <option value="rejected">Rejected</option>
        <option value="withdrawn">Withdrawn</option>
      </select>
    </div>

                {selectedApplication.job_url && (
              <p>
                <strong>Job posting:</strong>{" "}
                <a
                  href={selectedApplication.job_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open original job posting
                </a>
              </p>
            )}

            <div>
              <label htmlFor="edit-notes">
                <strong>Notes:</strong>
              </label>

              <textarea
                id="edit-notes"
                value={editNotes}
                onChange={(event) => setEditNotes(event.target.value)}
              />
            </div>

            <button type="button" onClick={handleUpdate}>
              Save changes
            </button>

            <button type="button" onClick={handleDelete}>
              Delete application
            </button>
          </div>
        ) : (
          <p>Select an application to view its details.</p>
        )}
      </section>
    </main>
  )
}

export default App