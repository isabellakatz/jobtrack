import { useEffect, useState } from "react"

import {
  createApplication,
  deleteApplication,
  getApplications,
  updateApplication
} from "./services/applicationApi"

import type {
  ApplicationStatus,
  JobApplication 
} from "./types/application"

import "./App.css"


function App() {
  // 1. STATE
  //The App component is the main component of the application. It fetches job applications from the backend and displays them in a list.
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // selectedApplication = keeps track of the currently selected job application.
  const [selectedApplicationId, setSelectedApplicationId] =
  useState<number | null>(null)

  // editStatus = separate form to edit the status of a selected job application.
  const [editStatus, setEditStatus] = 
    useState<ApplicationStatus>("saved")
  
    // editNotes = separate form to edit the notes of a selected job application.
  const [editNotes, setEditNotes] = useState("")

  const [company, setCompany] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [location, setLocation] = useState("")  
  const [job_url, setJobUrl] = useState("")
  const [description, setDescription] = useState("")
  const [requirements, setRequirements] = useState("")
  const [status, setStatus] = useState<ApplicationStatus>("saved")
  const [appliedDate, setAppliedDate] = useState("")
  const [notes, setNotes] = useState("")


  const [submitting, setSubmitting] = useState(false)

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
    applications.find(
      (application) => application.id === selectedApplicationId
    ) ?? null

    // 4. LOAD SELECTED APPLICATION DETAILS INTO EDIT FIELDS
    useEffect(() => {
      if (selectedApplication) {
        setEditStatus(selectedApplication.status)
        setEditNotes(selectedApplication.notes ?? "")
      }
    }, [selectedApplication])
  
    // 5. CREATE A NEW APPLICATION
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  // Prevent the default form submission behavior, which would cause a page reload.
    event.preventDefault()

  try {
    setSubmitting(true)
    setError(null)

    // createApplication() = Send a POST request to the backend to create a new job application
    const newApplication = await createApplication({
      company,
      job_title: jobTitle,
      location: location || null,
      job_url: job_url || null,
      description: description || null,
      requirements: requirements || null,
      status,
      applied_date: appliedDate || null,
      notes: notes || null,
    })

    // Update the applications state with the newly created application. 
    // The new application is added to the beginning of the list.
    setApplications((currentApplications) => [
      newApplication,
      ...currentApplications,
    ])

    setSelectedApplicationId(newApplication.id)
    setCompany("")
    setJobTitle("")
    setLocation("")
    setJobUrl("")
    setDescription("")
    setRequirements("")
    setStatus("saved")
    setAppliedDate("")
    setNotes("")
  } catch {
    setError("Could not create application.")
  } finally {
    setSubmitting(false)
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

      <h2>Add application</h2>

<form onSubmit={handleSubmit}>
  <div>
    <label htmlFor="company">Company</label>
    <input
      id="company"
      type="text"
      value={company}
      // onChange = updates the company state whenever the user types in the input field. 
      // It takes the event object as an argument and sets the company state to the value of the input field (event.target.value).
      onChange={(event) => setCompany(event.target.value)}
      required
    />
  </div>

  <div>
    <label htmlFor="job-title">Job title</label>
    <input
      id="job-title"
      type="text"
      value={jobTitle}
      onChange={(event) => setJobTitle(event.target.value)}
      required
    />
  </div>

  <div>
    <label htmlFor="location">Location</label>
    <input
      id="location"
      type="text"
      value={location}
      onChange={(event) => setLocation(event.target.value)}
    />
  </div>

  <div>
    <label htmlFor="job-url">Job URL</label>
    <input
      id="job-url"
      type="url"
      value={job_url}
      onChange={(event) => setJobUrl(event.target.value)}
    />
  </div>

  <div>
    <label htmlFor="description">Description</label>
    <textarea
      id="description"
      value={description}
      onChange={(event) => setDescription(event.target.value)}
    />
  </div>

  <div>
    <label htmlFor="requirements">Requirements</label>
    <textarea
      id="requirements"
      value={requirements}
      onChange={(event) => setRequirements(event.target.value)}
    />
  </div>

  <div>
    <label htmlFor="status">Status</label>
    <select
      id="status"
      value={status}
      onChange={(event) =>
        setStatus(event.target.value as ApplicationStatus)
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

  <div>
    <label htmlFor="applied-date">Applied date</label>
    <input
      id="applied-date"
      type="date"
      value={appliedDate}
      onChange={(event) => setAppliedDate(event.target.value)}
    />
  </div>

  <div>
    <label htmlFor="notes">Notes</label>
    <textarea
      id="notes"
      value={notes}
      onChange={(event) => setNotes(event.target.value)}
    />
  </div>

  <button type="submit" disabled={submitting}>
    {submitting ? "Saving..." : "Add application"}
  </button>
</form>

      <h2>Applications</h2>

      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <ul>
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

      <p>
        <strong>Applied date:</strong>{" "}
        {selectedApplication.applied_date || "Not specified"}
      </p>

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

      <h4>Description</h4>
      <p>
        {selectedApplication.description || "No description saved."}
      </p>

      <h4>Requirements</h4>
      <p>
        {selectedApplication.requirements || "No requirements saved."}
      </p>
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
      <button type="button" 
      onClick={handleUpdate}
      >
        Save changes
      </button>

      <button
      type = "button"
      onClick={handleDelete}
      >
        Delete application
      </button>

    </div>
  ) : (
    <p>Select an application to view its details.</p>
  )}
</section>
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
    </main>
  )
}


export default App