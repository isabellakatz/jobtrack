import { useState } from "react"

import type {
    ApplicationStatus,
    JobApplicationCreate,

} from "../types/application"

// Handles the form submission event. When the user submits the form, the handleSubmit function is called.

interface ApplicationFormProps {
    onCreate : (application: JobApplicationCreate) => Promise<void>
}

// The state of the form in the component is managed using the useState hook, which allows the component to keep track of the values entered by the user in the form fields.
function ApplicationForm({ 
    onCreate, 
}: ApplicationFormProps) {
  const [company, setCompany] = useState("")
  const [job_Title, setJobTitle] = useState("")
  const [location, setLocation] = useState("")
  const [jobUrl, setJobUrl] = useState("")
  const [description, setDescription] = useState("")
  const [requirements, setRequirements] = useState("")
  const [status, setStatus] = useState<ApplicationStatus>("saved")
  const [appliedDate, setAppliedDate] = useState("")
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(
    event : React.FormEvent<HTMLFormElement> 
  ) {
    event?.preventDefault()

    try {
        setSubmitting(true)

        await onCreate({
            company,
            job_title: job_Title,
            location: location || null,
            job_url: jobUrl || null,
            description: description || null,
            requirements: requirements || null,
            status,
            applied_date: appliedDate || null,
            notes: notes || null,
        })

            // Clear the form after successful submission
        setCompany("")
        setJobTitle("")
        setLocation("")
        setJobUrl("")
        setDescription("")
        setRequirements("")
        setStatus("saved")
        setAppliedDate("")
        setNotes("")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="application-form">
      <h2>Add application</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="company">
            Company
          </label>

          <input
            id="company"
            type="text"
            value={company}
            onChange={(event) =>
              setCompany(event.target.value)
            }
            required
          />
        </div>


        <div>
          <label htmlFor="job-title">
            Job title
          </label>

          <input
            id="job-title"
            type="text"
            value={job_Title}
            onChange={(event) =>
              setJobTitle(event.target.value)
            }
            required
          />
        </div>


        <div>
          <label htmlFor="location">
            Location
          </label>

          <input
            id="location"
            type="text"
            value={location}
            onChange={(event) =>
              setLocation(event.target.value)
            }
          />
        </div>


        <div>
          <label htmlFor="job-url">
            Job posting URL
          </label>

          <input
            id="job-url"
            type="url"
            value={jobUrl}
            onChange={(event) =>
              setJobUrl(event.target.value)
            }
          />
        </div>


        <div>
          <label htmlFor="description">
            Description
          </label>

          <textarea
            id="description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
          />
        </div>


        <div>
          <label htmlFor="requirements">
            Requirements
          </label>

          <textarea
            id="requirements"
            value={requirements}
            onChange={(event) =>
              setRequirements(event.target.value)
            }
          />
        </div>


        <div>
          <label htmlFor="status">
            Status
          </label>

          <select
            id="status"
            value={status}
            onChange={(event) =>
              setStatus(
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
          <label htmlFor="applied-date">
            Applied date
          </label>

          <input
            id="applied-date"
            type="date"
            value={appliedDate}
            onChange={(event) =>
              setAppliedDate(event.target.value)
            }
          />
        </div>


        <div>
          <label htmlFor="notes">
            Notes
          </label>

          <textarea
            id="notes"
            value={notes}
            onChange={(event) =>
              setNotes(event.target.value)
            }
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
        >
          {submitting
            ? "Adding..."
            : "Add application"}
        </button>
      </form>
    </section>
  )
}

// The ApplicationForm component is exported as the default export of the module, so it can be imported and used in other parts of the application.
export default ApplicationForm