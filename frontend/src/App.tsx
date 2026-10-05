import { useEffect, useState } from "react"

import ApplicationForm from "./components/ApplicationForm"
import ApplicationList from "./components/ApplicationList"
import Dashboard from "./components/Dashboard"
import Sidebar from "./components/Sidebar"

import {
  createApplication,
  deleteApplication,
  getApplications,
  updateApplication
} from "./services/applicationApi"

import type {
  ApplicationStatus,
  JobApplication,
  JobApplicationCreate,
  JobApplicationUpdate,
} from "./types/application"

import "./App.css"


function App() {

  // To keep track of the current view, we use a state variable called activeView. 
  // It can be one of four values: "add", "dashboard", "applications", or "kanban". The default value is "dashboard".
  const [activeView, setActiveView] = useState<"add" | "dashboard" | "applications" | "cv" | "kanban" | "contacts">("dashboard")

  //The App component is the main component of the application. It fetches job applications from the backend and displays them in a list.
  const [applications, setApplications] =
    useState<JobApplication[]>([])

  // Used while applications are being loaded
  const [loading, setLoading] =
    useState(true)

  // Stores an error message if an API request fails
  const [error, setError] = useState<string | null>(null)

  // selectedApplication = keeps track of the currently selected job application
  const [selectedApplicationId, setSelectedApplicationId] =
    useState<number | null>(null)

  const [statusFilter, setStatusFilter] =
    useState<ApplicationStatus | "all">("all")

  // applicationStatusFilter = keeps track of the currently selected status filter for the application list
  const [applicationStatusFilter, setApplicationStatusFilter] =
    useState<ApplicationStatus | "all">("all")

  // applicationSort = keeps track of the currently selected sort order for the application list
  const [applicationSort, setApplicationSort] = useState<"newest" | "oldest" | "company-az" | "company-za">("newest")

  // filteredApplications = filters the list of applications based on the selected status filter.
  const filteredApplications =
    statusFilter === "all"
      ? applications
      : applications.filter(
        (application) =>
          application.status === statusFilter
      )

  // applicationsViewApplications = filters the list of applications based on the selected status filter for the application list view.
  const applicationsViewApplications =
    applicationStatusFilter === "all"
      ? applications
      : applications.filter(
        (application) =>
          application.status === applicationStatusFilter
      )

  // sortedApplications = sorts the application list based on the selected order.
  const sortedApplications =
  [...applicationsViewApplications].sort((a, b) => {
    if (
      applicationSort === "newest" ||
      applicationSort === "oldest"
    ) {
      const dateA = a.applied_date
        ? Date.parse(a.applied_date)
        : Number.NaN

      const dateB = b.applied_date
        ? Date.parse(b.applied_date)
        : Number.NaN

      if (!Number.isFinite(dateA)) {
        return Number.isFinite(dateB) ? 1 : 0
      }

      if (!Number.isFinite(dateB)) {
        return -1
      }

      return applicationSort === "newest"
        ? dateB - dateA
        : dateA - dateB
    }

    if (applicationSort === "company-az") {
      return a.company.localeCompare(b.company)
    }

    if (applicationSort === "company-za") {
      return b.company.localeCompare(a.company)
    }

    return 0
  })

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
      (application) =>
        application.id === selectedApplicationId
    ) ?? null


  // 4. SELECT AN APPLICATION
  function handleSelectApplication(applicationId: number) {
    setSelectedApplicationId(currentId =>
      currentId === applicationId
        ? null
        : applicationId)
  }

  // 5. CREATE A NEW APPLICATION - Is handled by the ApplicationForm component, which is a child of the App component. 
  // The onCreate prop is passed to the ApplicationForm component, which calls the handleCreateApplication function when the form is submitted.
  async function handleCreateApplication(
    applicationData: JobApplicationCreate
  ) {
    try {
      setError(null)

      const newApplication = await createApplication(applicationData)

      setApplications((currentApplications) => [
        newApplication,
        ...currentApplications,
      ])

      setSelectedApplicationId(newApplication.id)
    } catch {
      setError("Could not create application.")
    }
  }

  function handleStatusSelect(
    status: ApplicationStatus | "all"
  ) {
    setStatusFilter(status)
    //setActiveView("applications")
  }

  // 6. UPDATE AN EXISTING APPLICATION
  async function handleUpdateApplication(
    applicationId: number,
    updates: JobApplicationUpdate
  ) {
    try {
      setError(null)

      // updateApplication() = Send a PATCH request to the backend to update the selected job application 
      // with the new status and notes.
      const updatedApplication =
        await updateApplication(applicationId, updates)

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
  async function handleDeleteApplication(
    application: JobApplication
  ) {
    try {
      setError(null)

      // Sends DELETE-request to the backend (FastAPI) to delete the selected job application.
      await deleteApplication(application.id)

      // Update the React state to remove the deleted application from the list and clear the selected application.
      setApplications((currentApplications) =>
        currentApplications.filter(
          (currentApplication) => currentApplication.id !== application.id
        )
      )

      setSelectedApplicationId(null)
    } catch {
      setError("Could not delete application.")
    }
  }

  //9. EARLY RETURNS
  // Still waiting for the applications to load, show a loading message. 
  // If there was an error, show the error message. Otherwise, display the list of applications.
  if (loading) {
    return <p>Loading applications...</p>
  }


  if (error) {
    return <p>{error}</p>
  }

  return (
    <div className="app-layout">
      <Sidebar
        onNavigate={setActiveView}
      />

      <main className="app">
        <header className="app-header">
          <h1>JobTrack</h1>
          <p>Track your job applications in one place.</p>
        </header>

        <div className="app-content">

          {activeView === "add" && (
            <ApplicationForm
              onCreate={handleCreateApplication}
            />
          )}

          {activeView === "dashboard" && (
            <>
              <Dashboard
                applications={applicationsViewApplications}
                onStatusSelect={handleStatusSelect}
              />

              <ApplicationList
                applications={filteredApplications}
                selectedApplicationId={selectedApplicationId}
                onSelect={handleSelectApplication}
                selectedApplication={selectedApplication}
                onUpdate={handleUpdateApplication}
                onDelete={handleDeleteApplication}
              />
            </>
          )}
        </div>

        {activeView === "applications" && (
          <>
            <div className="application-filters">
              <label htmlFor="status-filter">
                Status
              </label>

              <select
                id="status-filter"
                value={applicationStatusFilter}
                onChange={(event) =>
                  setApplicationStatusFilter(
                    event.target.value as ApplicationStatus | "all"
                  )
                }
              >
                <option value="all">All</option>
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
              <label htmlFor="sort-order">
                Sort by
              </label>

              <select
                id="sort-order"
                value={applicationSort}
                onChange={(event) =>
                  setApplicationSort(
                    event.target.value as "newest" | "oldest" | "company-az" | "company-za"
                  )
                }
              >
                <option value="newest">
                  Newest first
                </option>

                <option value="oldest">
                  Oldest first
                </option>

                <option value="company-az">
                  Company (A-Z)
                </option>

                <option value="company-za">
                  Company (Z-A)
                </option>

              </select>
            </div>

            <ApplicationList
              applications={sortedApplications}
              selectedApplicationId={selectedApplicationId}
              onSelect={handleSelectApplication}
              selectedApplication={selectedApplication}
              onUpdate={handleUpdateApplication}
              onDelete={handleDeleteApplication}
            />
          </>
        )}
      </main>
    </div >
  )
}

export default App
