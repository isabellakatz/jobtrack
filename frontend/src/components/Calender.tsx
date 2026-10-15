import { useState } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/react/daygrid"

import "@fullcalendar/react/skeleton.css"


function Calendar() {

    const [events, setEvents] = useState([
        { title: "Test event", date: "2026-10-06", time: "10:00" },
        { title: "Atea x Women in Tech", date: "2026-10-08", time: "17:30" }
    ])

    //false -> modal is closed, true -> modal is open
    const [isAddEventOpen, setIsAddEventOpen] = useState(false)

    const [eventTitle, setEventTitle] = useState("")
    const [eventDate, setEventDate] = useState("")
    const [eventTime, setEventTime] = useState("")

    //const handleAddEvent = () => {

    return (
        <section className="calendar-view">
            <h2>Calendar</h2>

            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={events}
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

                        <p>Add event form here later...</p>

                        <button
                            type="button"
                            onClick={() => setIsAddEventOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </section>
    )
}


export default Calendar