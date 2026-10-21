import type {
    CalendarEventCreate,
    CalendarEvent
} from "../types/calendarEvents"

const API_URL = "http://127.0.0.1:8000"

export async function getEvents(): Promise<CalendarEvent[]> {
    const response = await fetch(`${API_URL}/events`)

    if (!response.ok) {
        throw new Error("Failed to fetch events")
    }

    return response.json()
}

export async function createEvent(
    event: CalendarEventCreate
): Promise<CalendarEvent> {
    const response = await fetch(`${API_URL}/events`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        // converts the JavaScript object event  into a JSON string to be sent in the HTTP-request body to the backend.
        body: JSON.stringify(event),
    })

    if (!response.ok) {
        const errorText = await response.text()

        throw new Error(
            `Failed to create event: ${response.status} ${errorText}`
        )
    }

    return response.json()
}