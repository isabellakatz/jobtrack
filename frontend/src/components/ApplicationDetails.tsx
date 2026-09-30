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

  // Edit application (show application -> false, when editing -> true)
  const [isEditingApplication, setIsEditingApplication] = useState(false)

  // States for all fields that should be able to modify
  const [editCompany, setEditCompany] = useState("")
  const [editJobTitle, setEditJobTitle] = useState("")
  const [editLocation, setEditLocation] = useState("")
  const [editJobUrl, setEditJobUrl] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editRequirements, setEditRequirements] = useState("")
  const [editStatus, setEditStatus] = useState<ApplicationStatus>("saved")
  const [editAppliedDate, setEditAppliedDate] = useState("")
  const [editNotes, setEditNotes] = useState("")


  useEffect(() => {
    if (application) {
      setEditCompany(application.company)
      setEditJobTitle(application.job_title)
      setEditLocation(application.location ?? "")
      setEditJobUrl(application.job_url ?? "")
      setEditDescription(application.description ?? "")
      setEditRequirements(application.requirements ?? "")
      setEditStatus(application.status)
      setEditAppliedDate(application.applied_date ?? "")
      setEditNotes(application.notes ?? "")

      setIsEditingApplication(false)
    }
}, [application])

// Sends the changes to backend
async function handleSave() {
    if (!application) {
        return
    }

    await onUpdate(application.id, {
        company: editCompany,
        job_title: editJobTitle,
        location: editLocation || null,
        job_url: editJobUrl || null,
        description: editDescription || null,
        requirements: editRequirements || null,
        status: editStatus,
        applied_date: editAppliedDate || null,
        notes: editNotes || null,
    })

    setIsEditingApplication(false)
}

// Erases the changes and resets to origin values
function handleCancel() {
    if (!application) {
        return
    }

    setEditCompany(application.company)
    setEditJobTitle(application.job_title)
    setEditLocation(application.location ?? "")
    setEditJobUrl(application.job_url ?? "")
    setEditDescription(application.description ?? "")
    setEditRequirements(application.requirements ?? "")
    setEditStatus(application.status)
    setEditAppliedDate(application.applied_date ?? "")
    setEditNotes(application.notes ?? "")

    setIsEditingApplication(false)
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
        <>
        {isEditingApplication ? (
        <div>
          <h3>Edit application</h3>

          <div>
            <label htmlFor="edit-company">
                Company
            </label>

            <input 
                id="edit-company"
                type="text" 
                value={editCompany}
                onChange={(event) =>
                    setEditCompany(event.target.value)
                }
            />
        </div>      

        <div>
            <label htmlFor="edit-job-title">
                Job title
            </label>
            
            <input
                id="edit-job-title"
                type="text"
                value={editJobTitle}
                onChange={(event) =>
                    setEditJobTitle(event.target.value)
                }
            />
        </div>

        <div>
            <label htmlFor="edit-location">
                Location
            </label>
            
            <input
                id="edit-location"
                type="text"
                value={editLocation}
                onChange={(event) =>
                    setEditLocation(event.target.value)
                }
            />
        </div>

        <div>
            <label htmlFor="edit-job-url">
                Job posting URL
            </label>

            <input
                id="edit-job-url"
                type="text"
                value={editJobUrl}
                onChange={(event) =>
                    setEditJobUrl(event.target.value)
                }   
            />
        </div>

        <div>
            <label htmlFor="edit-description">
                Description
            </label>

            <textarea
                id="edit-description"
                value={editDescription}
                onChange={(event) =>
                    setEditDescription(event.target.value)
                }   
            />
        </div>

        <div>
            <label htmlFor="edit-requirements">
                Requirements
            </label>

            <textarea
                id="edit-requirements"
                value={editRequirements}
                onChange={(event) =>
                    setEditRequirements(event.target.value)
                }   
            />
        </div>

        <div>
            <label htmlFor="edit-status">
                Status
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

        <div>
            <label htmlFor="edit-applied-date">
                Applied Date
            </label>
            
            <input
                id="edit-applied-date"
                type="date"
                value={editAppliedDate}
                onChange={(event) =>
                    setEditAppliedDate(event.target.value)
                }
            />
        </div>

        <div>
            <label htmlFor="edit-notes">
                Notes
            </label>

            <textarea
                id="edit-notes"
                value={editNotes}
                onChange={(event) =>
                    setEditNotes(event.target.value)
                }   
            />
        </div>        



        <button
            type="button"
            className="save-button"
            onClick={handleSave}
            >
                Save changes
        </button>

        <button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
            >
                Cancel
            </button>
        </div>

      ) : (

        <div className="application-info">
            <h3>{application.company}</h3>
          
          <p>
            <strong>Role:</strong>{" "}
            {application.job_title}
          </p>
          
          <p>
            <strong>Location:</strong>{" "}
            {application.location || "Not specified"}
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
          )
        }
          
        <div>
            <h4>Description</h4>
            <p className="application-long-text">
            {application.description ||
            "[No description saved]"}
          </p>
        </div>

        <div>
            <h4>Requirements</h4>
            <p className="application-long-text">
            {application.requirements ||
            "[No requirements saved]"}
          </p>
        </div>

        <div>
            <h4>Notes</h4>
            <p className="application-long-text">
            {application.notes ||
            "[No notes saved]"}
          </p>
        </div>      

          <button
            type="button"
            className="edit-button"
            onClick={() =>
                setIsEditingApplication(true)
            }
          >
            Edit application
          </button>

          <button
            type="button"
            className="delete-button"
            onClick={handleDelete}
          >
            Delete application
          </button>
        </div>
      )}
      </>
      ) : (
        <p>Select an application to view its details</p>
      )}


 {/*          <div>
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
} */}
</section>
      )}

export default ApplicationDetails