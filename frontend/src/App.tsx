import { useEffect, useState } from "react"

import LoginForm from "./components/LoginForm"
import RegisterForm from "./components/RegisterForm"
import ApplicationForm from "./components/ApplicationForm"
import ApplicationList from "./components/ApplicationList"
import Dashboard from "./components/Dashboard"
import Sidebar from "./components/Sidebar"
import Calendar from "./components/Calender"

import UserMenu from "./components/UserMenu"
import { getCurrentUser } from "./services/authApi"

import type { User } from "./types/auth"

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

/**
 * Main component for JobTrack.
 * Coordinates authentication, application data, filtering and page navigation.
 * 
 * API calls are defined in the service files; child components handle the UI.
 */

function App() {

  // Token received after login; used to authenticate requests to protected API endpoints.
  const [accessToken, setAccessToken] = useState<string | null>(null)

  // Current user information, fetched from the backend after login. If null, no user is logged in.
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // LoginForm calls this after successful authentication.
  function handleLogin(token: string) {
    setAccessToken(token)
  }

  // Switches between login and registration while the user is logged out.
  const [authView, setAuthView] = useState<"login" | "register">("login")


  // Determines which section is shown. Some values are reserved for views
  // that are not yet rendered in this component.
  const [activeView, setActiveView] = useState<"add" | "dashboard" | "todo" | "applications" | "calendar" | "cv" | "kanban" | "contacts">("dashboard")

  // Local list of applications fetched from the backend.
  // Updated after successful create, update and delete requests.
  const [applications, setApplications] =
    useState<JobApplication[]>([])

  // Tracks loading of the application list (not the current-user profile).
  const [loading, setLoading] =
    useState(true)

  // Stores an error message if an API request fails
  const [error, setError] = useState<string | null>(null)

  // ID of the application whose details are open, keeps track of the currently selected job application, null means none is selected.
  const [selectedApplicationId, setSelectedApplicationId] =
    useState<number | null>(null)

  // The Dashboard and Applications views have independent status filters.
  // "all" means that no status filtering is applied.
  const [statusFilter, setStatusFilter] =
    useState<ApplicationStatus | "all">("all")

  const [applicationStatusFilter, setApplicationStatusFilter] =
    useState<ApplicationStatus | "all">("all")

  // Sort order used by the separate Applications view.
  const [applicationSort, setApplicationSort] = useState<"newest" | "oldest" | "company-az" | "company-za">("newest")

  // Text entered into the Applications search field (filtering applications by company or role).
  // Not implemented yet: The search field is rendered, but the search results are not displayed in the UI. 
  const [applicationSearch, setApplicationSearch] = useState("")


  // Case-insensitive search by company or job title.
  // TODO: This result is currently not passed to ApplicationList, so search
  // input does not affect the displayed list yet.
  const searchedApplications =
    applicationSearch === ""
      ? applications
      : applications.filter(
        (applicationsViewApplications) =>
          applicationsViewApplications.company
            .toLowerCase()
            .includes(applicationSearch.toLowerCase()) ||
          applicationsViewApplications.job_title
            .toLowerCase()
            .includes(applicationSearch.toLowerCase())
      )

  // Filter the list shown beneath the Dashboard's status counters.
  const filteredApplications =
    statusFilter === "all"
      ? applications
      : applications.filter(
        (application) =>
          application.status === statusFilter
      )


  // Apply the independent status filter in the Applications view.
  const applicationsViewApplications =
    applicationStatusFilter === "all"
      ? applications
      : applications.filter(
        (application) =>
          application.status === applicationStatusFilter
      )

  // Sort a copy of the Applications-view list instead of mutating React state.
  // When sorting by date, applications with missing/invalid dates go last.
  const sortedApplications =
    // CREATE A NEW ARRAY COPY. SORT APPLICATIONS BASED ON SELECTED ORDER
    [...applicationsViewApplications].sort((a, b) => {
      if (
        applicationSort === "newest" ||
        applicationSort === "oldest"
      ) {
        const dateA = a.applied_date
          ? Date.parse(a.applied_date)
          : Number.NaN // If applied_date is null, set dateA to NaN - Not a number.

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

  // Reload applications whenever the access token changes (e.g. on login).
  // When logged out, clear data belonging to the previous session.
  useEffect(() => {
    // Do not load applications before the user is logged in
    if (!accessToken) {
      setApplications([])
      setLoading(false)
      return
    }

    const token = accessToken

    async function loadApplications() {
      try {
        setLoading(true)
        setError(null)

        const data = await getApplications(token)

        setApplications(data)
      } catch {
        setError("Could not load applications.")
      } finally {
        setLoading(false)
      }
    }

    loadApplications()
  }, [accessToken])

  // Load information about the logged-in user
  // Load the user profile whenever the access token changes.
  // A failure here is logged, but does not trigger the main error screen.
  useEffect(() => {
    if (!accessToken) {
      setCurrentUser(null)
      return
    }

    const token = accessToken

    async function loadCurrentUser() {
      try {
        const user = await getCurrentUser(token)

        setCurrentUser(user)
      } catch (error) {
        console.error("Could not load user:", error)
      }
    }

    loadCurrentUser()

  }, [accessToken])

  // Find the selected record from the current list so it stays up to date after an edit.
  // Return null if no record matches the selected ID.F
  const selectedApplication =
    applications.find(
      (application) =>
        application.id === selectedApplicationId
    ) ?? null


  // Open an application's details, or close them if it is clicked again.
  function handleSelectApplication(applicationId: number) {
    setSelectedApplicationId(currentId =>
      currentId === applicationId
        ? null
        : applicationId)
  }


  // ApplicationForm calls this through its onCreate prop.
  // POST the new application, then add the returned record to local state
  // without fetching the entire list again.
  async function handleCreateApplication(
    applicationData: JobApplicationCreate
  ) {
    if (!accessToken) {
      return
    }

    try {
      setError(null)

      const newApplication = await createApplication(
        applicationData,
        accessToken
      )

      setApplications((currentApplications) => [
        newApplication,
        ...currentApplications,
      ])

      setSelectedApplicationId(newApplication.id)

    } catch {
      setError("Could not create application.")
    }
  }

  // Dashboard calls this when a status counter is selected.
  function handleStatusSelect(
    status: ApplicationStatus | "all"
  ) {
    setStatusFilter(status)
    //setActiveView("applications")
  }

  // ApplicationList calls this through its onUpdate prop.
  // PATCH the application and replace its local record with the API response.
  async function handleUpdateApplication(
    applicationId: number,
    updates: JobApplicationUpdate
  ) {
    if (!accessToken) {
      return
    }

    try {
      setError(null)

      // updateApplication() = Send a PATCH request to the backend to update the selected job application 
      // with the new status and notes.
      const updatedApplication =
        await updateApplication(
          applicationId,
          updates,
          accessToken
        )


      // map() = creates a new array and preserves all unchanged applications.
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

  // Sidebar calls this callback to switch views without changing the URL.
  // Reset selection and view-specific filters when navigating.
  function handleNavigate(
    view:
      | "add"
      | "dashboard"
      | "todo"
      | "applications"
      | "calendar"
      | "cv"
      | "kanban"
      | "contacts"
  ) {
    // Close any currently opened application
    setSelectedApplicationId(null)

    // Reset Dashboard filter when opening Dashboard
    if (view === "dashboard") {
      setStatusFilter("all")
    }

    // Reset Applications filters when opening Applications
    if (view === "applications") {
      setApplicationStatusFilter("all")
      setApplicationSearch("")
      setApplicationSort("newest")
    }

    setActiveView(view)
  }

  // Clear authentication and user-specific data from React state.
  // This function does not call a separate backend logout endpoint.
  function handleLogout() {
    setAccessToken(null)
    setCurrentUser(null)
    setApplications([])
    setSelectedApplicationId(null)
    setError(null)
    setActiveView("dashboard")
  }

  // Clear authentication and user-specific data from React state.
  // This function does not call a separate backend logout endpoint.
  async function handleDeleteApplication(
    application: JobApplication
  ) {
    if (!accessToken) {
      return
    }

    try {
      setError(null)

      // Sends DELETE-request to the backend (FastAPI) to delete the selected job application.
      await deleteApplication(
        application.id,
        accessToken
      )

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

  // Early returns: show authentication forms before the main application.
  // Once logged in, show loading or error feedback until the main UI is ready.
  if (!accessToken) {
    if (authView === "register") {
      return (
        <RegisterForm
          onShowLogin={() =>
            setAuthView("login")
          }
        />
      )
    }

    return (
      <LoginForm
        onLogin={handleLogin}
        onShowRegister={() =>
          setAuthView("register")
        }
      />
    )
  }

  if (loading) {
    return <p>Loading applications...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div className="app-layout">
      {/* Sidebar controls navigation; App owns the activeView state. */}
      <Sidebar
        onNavigate={handleNavigate}
      />

      <main className="app">

        {/* Show account actions after the profile request has succeeded. */}
        {currentUser && (
          <UserMenu
            user={currentUser}
            onLogout={handleLogout}
          />
        )}

        <header className="app-header">
          <h1>JobTrack</h1>
          <p>Track your job applications in one place.</p>
        </header>


        <div className="app-content">

          {/* The form sends submitted data back through onCreate. */}
          {activeView === "add" && (
            <ApplicationForm
              onCreate={handleCreateApplication}
            />
          )}


          {/* Dashboard receives all applications for its status summary;
              the list underneath uses the separate Dashboard status filter. */}
          {activeView === "dashboard" && (
            <>
              <section className="dashboard-section">
                <Dashboard
                  applications={applications}
                  onStatusSelect={handleStatusSelect}
                />
              </section>

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


          {/* Dedicated list view with its own status, search and sort controls.
              Note: search is not yet connected to the displayed results. */}
          {activeView === "applications" && (
            <>
              <div className="application-filters">

                {/* Search */}
                <div className="filter-field filter-search">
                  <label htmlFor="application-search">
                    Search
                  </label>

                  <input
                    id="application-search"
                    type="text"
                    value={applicationSearch}
                    onChange={(event) =>
                      setApplicationSearch(event.target.value)
                    }
                    placeholder="Search company or role..."
                  />
                </div>


                {/* Status */}
                <div className="filter-field">
                  <label htmlFor="status-filter">
                    Status
                  </label>

                  <select
                    id="status-filter"
                    value={applicationStatusFilter}
                    onChange={(event) =>
                      setApplicationStatusFilter(
                        event.target.value as
                        | ApplicationStatus
                        | "all"
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


                {/* Sort by */}
                <div className="filter-field">
                  <label htmlFor="sort-filter">
                    Sort by
                  </label>

                  <select
                    id="sort-filter"
                    value={applicationSort}
                    onChange={(event) =>
                      setApplicationSort(
                        event.target.value as
                        | "newest"
                        | "oldest"
                        | "company-az"
                        | "company-za"
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
                      Company A-Z
                    </option>

                    <option value="company-za">
                      Company Z-A
                    </option>
                  </select>
                </div>

              </div>


              {/* Pass filtered/sorted records and CRUD callbacks to the list. */}
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


          {/* Calendar view is not yet implemented. */}
          {activeView === "calendar" && (
            <Calendar />
          )}

        </div>

      </main>
    </div>
  )
}

export default App
