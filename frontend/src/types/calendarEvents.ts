/**
 * CalendarEventCreate = what frontend sents to POST /events
 */
export interface CalendarEventCreate {
  title: string
  event_date: string
  start_time?: string | null
  notes?: string | null
}

/**
 * CalendarEvent = what backend sends back
 */
export interface CalendarEvent {
  id: number
  title: string
  event_date: string
  start_time: string | null
  notes: string | null
  created_at: string
  updated_at: string
}