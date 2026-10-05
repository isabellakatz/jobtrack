import type {
  JobApplication,
  JobApplicationUpdate
} from "../types/application"

import ApplicationDetails from "./ApplicationDetails"

// The interface ApplicationListProps defines the props that the ApplicationList component expects to receive. 
// It includes an array of JobApplication objects, a selectedApplicationId which can be a number or null, 
// and an onSelect function that takes an applicationId as an argument and returns void.

interface ApplicationListProps {
  applications: JobApplication[]
  selectedApplicationId: number | null
  selectedApplication: JobApplication | null

  onSelect: (applicationId: number) => void

  onUpdate: (
    applicationId: number,
    updates: JobApplicationUpdate
  ) => Promise<void>

  onDelete: (
    application: JobApplication
  ) => Promise<void>
}


function ApplicationList({
  applications,
  selectedApplicationId,
  selectedApplication,
  onSelect,
  onUpdate,
  onDelete
}: ApplicationListProps) {
  return (
    <section className="application-list">

      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <ul>
          {applications.map((application) => (
            <li key={application.id}>
              <button
                type="button"
                className="application-card-button"
                onClick={() => onSelect(application.id)}
                // The aria-pressed attribute is used to indicate that the current button is in a pressed state (active).
                aria-pressed={application.id === selectedApplicationId}
              >
                <span className="application-company">
                  {application.company}
                </span>

                <span className="application-role">
                  {application.job_title}
                </span>

                <span
                  className={`application-status status-${application.status}`}
                >
                  {application.status}
                </span>
              </button>

              {/* If the current application is selected and there is a selected application, render the ApplicationDetails component. */}
              {selectedApplicationId === application.id &&
                selectedApplication && (
                  <ApplicationDetails
                    application={selectedApplication}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                  />
                )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}


export default ApplicationList