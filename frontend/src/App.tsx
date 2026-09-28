import { useEffect, useState } from "react"

import ApplicationForm from "./components/ApplicationForm"
import ApplicationList from "./components/ApplicationList"
import ApplicationDetails from "./components/ApplicationDetails"
import Dashboard from "./components/Dashboard"

import {
  createApplication,
  deleteApplication,
  getApplications,
  updateApplication
} from "./services/applicationApi"

import type {
  JobApplication,
  JobApplicationCreate,
  JobApplicationUpdate,
} from "./types/application"

import "./App.css"


function App() {
  // 1. STATE
  //The App component is the main component of the application. It fetches job applications from the backend and displays them in a list.
  const [applications, setApplications] = 
  useState<JobApplication[]>([])
  
  // Used while applications are being loaded
  const [loading, setLoading] = 
  useState(true)
  
  // Stores an error message if an API request fails
  const [error, setError] = 
  useState<string | null>(null)

  // selectedApplication = keeps track of the currently selected job application
  const [selectedApplicationId, setSelectedApplicationId] =
  useState<number | null>(null)



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
    <main className="app">
      <header className="app-header">
        <h1>JobTrack</h1>
        <p>Track your job applications in one place.</p>
      </header>

      <Dashboard
        applications={applications}
      />

      <div className="app-grid">
      <ApplicationForm
        onCreate={handleCreateApplication}
      />

      <ApplicationList
        applications={applications}
        selectedApplicationId={selectedApplicationId}
        onSelect={setSelectedApplicationId}
      />
    </div>

      <ApplicationDetails
      application={selectedApplication}
      onUpdate={handleUpdateApplication}
      onDelete={handleDeleteApplication}
      />
    </main>
  )
}

export default App
