import { useEffect, useState } from "react"

import type {
    ApplicationStatus,
    JobApplication,
    JobApplicationUpdate,
} from "../types/application"

// Define the props that the ApplicationDetails component expects to receive.
interface ApplicationDetailsProps {
    // The selected job application to display details for. It can be null if no application is selected.
    application: JobApplication | null

    // Function to handle updating the selected job application.
    onUpdate: (applicationId: number,
        updates: JobApplicationUpdate
    ) => Promise<void>
    
    // Function to handle deleting the selected job application.
    onDelete: (application: JobApplication
    ) => Promise<void>
}

function ApplicationDetails({
    application,
    onUpdate,
    onDelete,
}: ApplicationDetailsProps) {

    // Local state for editing the selected application's status
  const [editStatus, setEditStatus] = useState<ApplicationStatus>("saved")
  
    // Local state for editing the selected application's notes
  const [editNotes, setEditNotes] = useState("")

  // Notes is read only, true = can edit.
  const [isEditingNotes, setIsEditingNotes] = useState(false)

  useEffect(() => {
    if (application) {
      setEditStatus(application.status)
      setEditNotes(application.notes ?? "")
      setIsEditingNotes(false)
    }
}, [application])

async function handleSave() {
    if (!application) {
        return
    }

    await onUpdate(application.id, {
        status: editStatus,
        notes: editNotes || null,
    })

    setIsEditingNotes(false)
}

async function handleDelete() {
    if (!application) {
        return
    }
    const confirmed = window.confirm(
        `Are you sure you want to delete the application for ${application.company} - ${application.job_title}?`
    )

    if (!confirmed) {
        return
    }

    await onDelete(application)
}

      return (
    <section className="application-details">
      <h2>Application details</h2>

      {application ? (
        <div>
          <h3>{application.company}</h3>

          <p>
            <strong>Role:</strong> {application.job_title}
          </p>

          <p>
            <strong>Location:</strong>{" "}
            {application.location || "Not specified"}
          </p>

          <div>
            <label htmlFor="edit-status">
              <strong>Status:</strong>
            </label>

            <select
              id="edit-status"
              value={editStatus}
              onChange={(event) =>
                setEditStatus(
                  event.target.value as ApplicationStatus
                )
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
            {application.applied_date || "Not specified"}
          </p>

          {application.job_url && (
            <p>
              <strong>Job posting:</strong>{" "}
              <a
                href={application.job_url}
                target="_blank"
                rel="noreferrer"
              >
                Open original job posting
              </a>
            </p>
          )}

          <h4>Description</h4>
          <p>
            {application.description ||
              "No description saved."}
          </p>

          <h4>Requirements</h4>
          <p>
            {application.requirements ||
              "No requirements saved."}
          </p>

          <div>
            <label htmlFor="edit-notes">
              <strong>Notes:</strong>
            </label>

            <textarea
              id="edit-notes"
              value={editNotes}
              readOnly={!isEditingNotes}
              onChange={(event) =>
                setEditNotes(event.target.value)
              }
            />
          </div>

            <button
            type="button"
            onClick={() => setIsEditingNotes(true)}
          >
            Edit notes
          </button>


          <button
            type="button"
            className="save-button"
            onClick={handleSave}
          >
            Save changes
          </button>

          <button
            type="button"
            className="delete-button"
            onClick={handleDelete}
          >
            Delete application
          </button>
        </div>
      ) : (
        <p>Select an application to view its details.</p>
      )}
    </section>
  )
}

export default ApplicationDetails