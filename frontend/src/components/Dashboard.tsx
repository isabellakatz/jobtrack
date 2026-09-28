import type { 
    JobApplication,
    ApplicationStatus,
 } from "../types/application";

// The interface DashboardProps defines the props that the Dashboard component expects to receive
// Which is a list of job applications
interface DashboardProps {
  applications: JobApplication[]
}

function Dashboard({
    applications,
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
                <div className="stat-card">
                    <span className="stat-label">
                        Total applications
                    </span>

                    <span className="stat-value">
                        {applications.length}
                    </span>
                </div>

                <div className="stat-card">
                    <span className="stat-label">
                        Applied
                    </span>

                    <span className="stat-value">
                        {appliedCount}
                    </span>
                </div>

                <div className="stat-card">
                    <span className="stat-label">
                        Saved
                    </span>

                    <span className="stat-value">
                        {savedCount}
                    </span>
                </div>

                <div className="stat-card">
                    <span className="stat-label">
                        Screening
                    </span>
                    <span className="stat-value">
                        {screeningCount}
                    </span>
                </div>

                <div className="stat-card">
                    <span className="stat-label">
                        Interview
                    </span>
                    <span className="stat-value">
                        {interviewCount}
                    </span>
                </div>

                <div className="stat-card">
                    <span className="stat-label">
                        Rejected
                    </span>
                    <span className="stat-value">
                        {rejectedCount}
                    </span>
                </div>

                <div className="stat-card">
                    <span className="stat-label">
                        Offer
                    </span>
                    <span className="stat-value">
                        {offerCount}
                    </span>

                </div>
                
                <div className="stat-card">
                    <span className="stat-label">
                        Withdrawn
                    </span>
                    <span className="stat-value">
                        {withdrawnCount}
                    </span>

                </div>

            </div>
        </section>
    )
}

export default Dashboard