import { useState } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/react/daygrid"

import "@fullcalendar/react/skeleton.css"

import type {
    CalendarEvent,
    CalendarEventCreate
} from "../types/calendarEvents"

import {
    createEvent
} from "../services/calendarEventApi"


function Calendar() {

    const [events, setEvents] = useState<CalendarEvent[]>([])

    //false -> modal is closed, true -> modal is open
    const [isAddEventOpen, setIsAddEventOpen] = useState(false)

    const [eventTitle, setEventTitle] = useState("")
    const [eventDate, setEventDate] = useState("")
    const [eventTime, setEventTime] = useState("")
    const [eventNotes, setEventNotes] = useState("")

    async function handleSave(
        event: React.SyntheticEvent<HTMLFormElement>
    ) {
        event.preventDefault()

        const newEvent: CalendarEventCreate = {
            title: eventTitle,
            event_date: eventDate,
            start_time: eventTime || null,
            notes: eventNotes || null
        }

        let savedEvent: CalendarEvent
        try {
            savedEvent = await createEvent(newEvent)
        } catch (error) {
            console.error("Failed to save calendar event:", error)
            window.alert("Could not save the event. Please try again.")
            return
        }

        setEvents((currentEvents) => [
            ...currentEvents,
            savedEvent
        ])

        setEventTitle("")
        setEventDate("")
        setEventTime("")
        setEventNotes("")

        setIsAddEventOpen(false)
    }

    /** Converts an API calendar event to FullCalendar's format, including its string ID and combined date/time. */
    function toFullCalendarEvent(event: CalendarEvent) {
        return {
            id: String(event.id),
            title: event.title,
            start: event.start_time
                ? `${event.event_date}T${event.start_time}`
                : event.event_date
        }
    }

    return (
        <section className="calendar-view">
            <h2>Calendar</h2>

            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={events.map(toFullCalendarEvent)}
                toolbarClass="calendar-toolbar"
                toolbarTitleClass="calendar-toolbar-title"
                buttonGroupClass="calendar-button-group"
                buttonClass="calendar-button"

                buttons={{
                    addEvent: {
                        text: "Add event",
                        click: () => setIsAddEventOpen(true),
                        className: "calendar-button-add-event",
                        isPrimary: true
                    }
                }}

                headerToolbar={{
                    start: "prev,next today",
                    center: "title",
                    end: "addEvent"
                }}

                titleFormat={{
                    year: "numeric",
                    month: "long"
                }}
            />

            {isAddEventOpen && (
                <div className="modal-overlay">
                    <div className="event-modal">
                        <h3>Add event</h3>

                        <form
                            className="event-form"
                            onSubmit={handleSave}
                        >
                            <div className="event-form-field">
                                <label htmlFor="event-title">
                                    Title
                                </label>
                                <input
                                    id="event-title"
                                    type="text"
                                    required
                                    value={eventTitle}
                                    onChange={(event) => setEventTitle(event.target.value)}
                                />
                            </div>
                            <div className="event-form-field">
                                <label htmlFor="event-date">
                                    Date
                                </label>
                                <input
                                    id="event-date"
                                    type="date"
                                    required
                                    value={eventDate}
                                    onChange={(event) => setEventDate(event.target.value)}
                                />
                            </div>
                            <div className="event-form-field">
                                <label htmlFor="event-time">
                                    Time
                                </label>
                                <input
                                    id="event-time"
                                    type="time"
                                    value={eventTime}
                                    onChange={(event) => setEventTime(event.target.value)}
                                />
                            </div>
                            <div className="event-form-field">
                                <label htmlFor="event-notes">
                                    Notes
                                </label>
                                <textarea
                                    id="event-notes"
                                    value={eventNotes}
                                    onChange={(event) => setEventNotes(event.target.value)}
                                />
                            </div>
                            <div className="event-form-actions">
                                <button
                                    type="button"
                                    onClick={() => setIsAddEventOpen(false)}
                                >
                                    Cancel
                                </button>

                                <button type="submit">
                                    Save event
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    )
}


export default Calendar