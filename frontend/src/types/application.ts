export type ApplicationStatus =
  | "saved"
  | "applied"
  | "screening"
  | "interview"
  | "offer"
  | "rejected"
  | "withdrawn"


export interface JobApplication {
  id: number

  company: string
  job_title: string

  location: string | null
  job_url: string | null

  description: string | null
  requirements: string | null

  status: ApplicationStatus
  applied_date: string | null

  notes: string | null

  created_at: string
  updated_at: string
}