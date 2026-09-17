import { useEffect, useState } from "react"

import { getApplications } from "./services/applicationApi"
import type { JobApplication } from "./types/application"

import "./App.css"


function App() {
  //The App component is the main component of the application. It fetches job applications from the backend and displays them in a list.
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


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


  // Still waiting for the applications to load, show a loading message. If there was an error, show the error message. Otherwise, display the list of applications.
  if (loading) {
    return <p>Loading applications...</p>
  }


  if (error) {
    return <p>{error}</p>
  }


  return (
    <main>
      <h1>JobTrack</h1>
      <p>Track your job applications in one place.</p>

      <h2>Applications</h2>

      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <ul>
          {applications.map((application) => (
            <li key={application.id}>
              <strong>{application.company}</strong>
              {" — "}
              {application.job_title}
              {" — "}
              {application.status}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}


export default App