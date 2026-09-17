import { useEffect, useState } from "react"

import {
  createApplication,
  getApplications 
} from "./services/applicationApi"

import type {
  ApplicationStatus,
  JobApplication 
} from "./types/application"

import "./App.css"


function App() {
  //The App component is the main component of the application. It fetches job applications from the backend and displays them in a list.
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // selectedApplication = keeps track of the currently selected job application.
  const [selectedApplicationId, setSelectedApplicationId] =
  useState<number | null>(null)

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

  const selectedApplication =
    applications.find(
      (application) => application.id === selectedApplicationId
    ) ?? null
  
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
      type="text"
      value={description}
      onChange={(event) => setDescription(event.target.value)}
    />
  </div>

  <div>
    <label htmlFor="requirements">Requirements</label>
    <input
      id="requirements"
      type="text"
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

      <p>
        <strong>Status:</strong> {selectedApplication.status}
      </p>

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

      <h4>Notes</h4>
      <p>
        {selectedApplication.notes || "No notes added."}
      </p>
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