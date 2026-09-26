import type { JobApplication } from "../types/application"

// The interface ApplicationListProps defines the props that the ApplicationList component expects to receive. 
// It includes an array of JobApplication objects, a selectedApplicationId which can be a number or null, 
// and an onSelect function that takes an applicationId as an argument and returns void.

interface ApplicationListProps {
  applications: JobApplication[]
  selectedApplicationId: number | null
  onSelect: (applicationId: number) => void
}


function ApplicationList({
  applications,
  selectedApplicationId,
  onSelect,
}: ApplicationListProps) {
  return (
    <section className="application-list">
      <h2>Applications</h2>

      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <ul>
          {applications.map((application) => (
            <li key={application.id}>
              <button
                type="button"
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
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}


export default ApplicationList