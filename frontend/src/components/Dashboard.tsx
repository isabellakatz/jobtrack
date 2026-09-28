import type { 
    JobApplication,
    ApplicationStatus,
 } from "../types/application";

// The interface DashboardProps defines the props that the Dashboard component expects to receive
// Which is a list of job applications
interface DashboardProps {
  applications: JobApplication[]

  onStatusSelect: (
    status: ApplicationStatus | "all"
  ) => void
}

function Dashboard({
    applications,
    onStatusSelect,
}: DashboardProps) {

function countByStatus(status : ApplicationStatus) {
    return applications.filter(
        (application) => application.status === status
        ).length
    }

const savedCount = countByStatus("saved")
const appliedCount = countByStatus("applied")
const screeningCount = countByStatus("screening")
const interviewCount = countByStatus("interview")
const offerCount = countByStatus("offer")
const rejectedCount = countByStatus("rejected")
const withdrawnCount = countByStatus("withdrawn")

    return (
        <section>
            <h2>Dashboard</h2>
            {/* dashboard-stats --> holds all the small boxes, stat-cards --> represents one box alone */}
            <div className="dashboard-stats">
                <button
                    type="button"
                    className="stat-card"
                    onClick={() =>
                        onStatusSelect("all")
                    }
                >
                    <span className="stat-label">
                        Total applications
                    </span>

                    <span className="stat-value">
                        {applications.length}
                    </span>
                </button>

                <button
                    type="button"
                    className="stat-card"
                    onClick={() =>
                        onStatusSelect("applied")
                    }
                >
                    <span className="stat-label">
                        Applied
                    </span>

                    <span className="stat-value">
                        {appliedCount}
                    </span>
                </button>

                <button
                    type="button"
                    className="stat-card"
                    onClick={() =>
                        onStatusSelect("saved")
                    }
                >
                    <span className="stat-label">
                        Saved
                    </span>

                    <span className="stat-value">
                        {savedCount}
                    </span>
                </button>

                <button
                    type="button"
                    className="stat-card"
                    onClick={() =>
                        onStatusSelect("screening")
                    }
                >
                    <span className="stat-label">
                        Screening
                    </span>

                    <span className="stat-value">
                        {screeningCount}
                    </span>
                </button>

                <button
                    type="button"
                    className="stat-card"
                    onClick={() =>
                        onStatusSelect("interview")
                    }
                >
                    <span className="stat-label">
                        Interview
                    </span>

                    <span className="stat-value">
                        {interviewCount}
                    </span>
                </button>

                <button
                    type="button"
                    className="stat-card"
                    onClick={() =>
                        onStatusSelect("rejected")
                    }
                >
                    <span className="stat-label">
                        Rejected
                    </span>

                    <span className="stat-value">
                        {rejectedCount}
                    </span>
                </button>    
                
                <button
                    type="button"
                    className="stat-card"
                    onClick={() =>
                        onStatusSelect("offer")
                    }
                >
                    <span className="stat-label">
                        Offer
                    </span>

                    <span className="stat-value">
                        {offerCount}
                    </span>
                </button>

                <button
                    type="button"
                    className="stat-card"
                    onClick={() =>
                        onStatusSelect("withdrawn")
                    }
                >
                    <span className="stat-label">
                        Withdrawn
                    </span>

                    <span className="stat-value">
                        {withdrawnCount}
                    </span>
                </button>
            </div>
        </section>
    )
}

export default Dashboard