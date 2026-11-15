# JobTrack

JobTrack is a full-stack web app for tracking job applications. It keeps job listings, application dates, statuses, and follow-up notes in one place.

## Features

- Create, view, update, and delete job applications.
- Record company names, job titles, locations, job posting links, and application dates.
- Update an application's status and edit notes in its detail view.
- See application counts by status and filter the list from the dashboard.

**Try it:** Save a sample application, change its status from `saved` to `applied`, add a note, and find it again using the dashboard's status filter.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React, TypeScript, Vite, CSS |
| API | Python, FastAPI |
| Data access | SQLAlchemy |
| Database | PostgreSQL |

The React client calls the FastAPI REST API. The backend reads and writes application records in PostgreSQL through SQLAlchemy.

## Run locally

You'll need Python, Node.js with npm, and a PostgreSQL database.

1. Create a Python virtual environment and install the backend dependencies.
2. Create a PostgreSQL database and configure the connection in the backend's environment settings. Keep credentials out of Git.
3. Start the backend from its working directory. If using Uvicorn, run `python -m uvicorn <module>:app --reload` after replacing `<module>` with the import path to the module that defines the FastAPI app.
4. In a second terminal, open the frontend directory and install its dependencies with `npm install`. Start Vite with `npm run dev` if the project uses the standard `dev` script, then open the URL printed in the terminal.

The interactive API documentation is available at `/docs` on the backend server.

## Application endpoints

| Method | Endpoint | Action |
| --- | --- | --- |
| GET | `/applications` | List applications |
| POST | `/applications` | Create an application |
| GET | `/applications/{id}` | Retrieve one application |
| PATCH | `/applications/{id}` | Update an application |
| DELETE | `/applications/{id}` | Delete an application |

## Project status

JobTrack is an ongoing portfolio project. The core application tracking flow is in place. JWT login has been tested against the backend in Swagger UI, and the frontend includes a login form. The complete browser account flow and the combination of search, sorting, and status filters still need end-to-end verification.

Planned improvements include UI polish, a drag-and-drop Kanban board, and application statistics over time.

Built by Isabella Katz.
