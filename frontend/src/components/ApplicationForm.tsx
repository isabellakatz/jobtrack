import { useState } from "react"

import type {
    ApplicationStatus,
    JobApplicationCreate,
    JobApplication,
    JobApplicationUpdate,
} from "../types/application"

// Handles the form submission event. When the user submits the form, the handleSubmit function is called.

interface ApplicationFormProps {
    onCreate : (application: JobApplicationCreate) => Promise<void>
}

// The state of the form in the component is managed using the useState hook, which allows the component to keep track of the values entered by the user in the form fields.
function ApplicationForm({ onCreate }: ApplicationFormProps) {
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

  return null
}

// The ApplicationForm component is exported as the default export of the module, so it can be imported and used in other parts of the application.
export default ApplicationForm

