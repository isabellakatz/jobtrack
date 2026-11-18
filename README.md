# JobTrack

JobTrack is a full-stack web application for organizing and tracking job applications. It brings job details, application statuses, dates, and notes together in one place.

This is an ongoing portfolio project built with React, FastAPI, and PostgreSQL.

## Features

- Register an account and log in.
- Create, view, update, and delete job applications.
- Save company names, job titles, locations, job posting links, descriptions, requirements, dates, and notes.
- Track applications through seven statuses: `saved`, `applied`, `screening`, `interview`, `offer`, `rejected`, and `withdrawn`.
- View application counts by status on a dashboard and select a status to filter the list.
- Filter the Applications view by status and sort by application date or company name.
- Keep each user's job applications separate through authenticated API requests.

A calendar interface is also included, but its connection to the authenticated API is still in progress. See [Current limitations](#current-limitations).

## Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, TypeScript, Vite, CSS |
| Backend | Python, FastAPI, SQLAlchemy |
| Database | PostgreSQL |
| Authentication | JWT bearer tokens, Argon2 password hashing |
| Calendar UI | FullCalendar |

## Project structure

```text
jobtrack/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI application and API endpoints
│   │   ├── models.py        # SQLAlchemy database models
│   │   ├── schemas.py       # Pydantic request/response schemas
│   │   ├── database.py      # Database engine and sessions
│   │   ├── config.py        # Environment configuration
│   │   ├── security.py      # Password hashing and JWT authentication
│   │   └── init_db.py       # Creates database tables
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # React UI components
│   │   ├── services/        # Requests to the FastAPI backend
│   │   ├── types/           # TypeScript types
│   │   └── App.tsx          # Main application component
│   ├── package.json
│   └── package-lock.json
└── README.md
```

The setup below also requires a local `backend/.env` file, which you create yourself. It is excluded from Git.

## Run locally

These instructions run JobTrack on your own computer, using a local PostgreSQL database.

### Prerequisites

Install:

- **Python 3.11 or newer**, with `pip`
- **Node.js 22.12 or newer** (or Node.js 20.19+) and `npm`, as required by the version of Vite used in this project
- **PostgreSQL**, installed and running locally

The commands below assume you have downloaded or cloned the repository and opened a terminal in the **project's root folder** (the folder containing `backend` and `frontend`).

### 1. Create the PostgreSQL database

Open PostgreSQL's command-line client:

```bash
psql -U postgres -h localhost
```

Enter your PostgreSQL administrator password if prompted. Create a dedicated user and database (replace `your_password` with a password of your choice):

```sql
CREATE USER jobtrack_user WITH PASSWORD 'your_password';
CREATE DATABASE jobtrack_db OWNER jobtrack_user;
```

Type `\q` to leave the PostgreSQL client.

Alternatively, create the same user and database with **pgAdmin**. Keep the credentials for the next step.

### 2. Set up the backend

From the project root, open a terminal and run:

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment:

**Windows (PowerShell)**

```powershell
.\.venv\Scripts\Activate.ps1
```

**macOS / Linux**

```bash
source .venv/bin/activate
```

Install the backend dependencies from `backend/requirements.txt`:

```bash
python -m pip install -r requirements.txt
```

The file must be present in `backend/` and include the dependencies imported by the project, including FastAPI, Uvicorn, SQLAlchemy, the PostgreSQL driver, Pydantic, Pydantic Settings, password hashing, JWT support, and email validation.

Create a file named **`.env`** directly inside `backend/` (next to `requirements.txt`), with these values:

```dotenv
DATABASE_URL=postgresql+psycopg2://jobtrack_user:your_password@localhost:5432/jobtrack_db
JWT_SECRET_KEY=replace_with_a_long_random_secret
```

Replace `your_password` with the password from step 1. Generate a random JWT secret with:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Copy the output into `JWT_SECRET_KEY`. If your database password contains URL-special characters (such as `@`, `#`, `/`, or `:`), percent-encode those characters in `DATABASE_URL`. **Do not commit `.env` to Git.**

Create the database tables:

```bash
python -m app.init_db
```

You should see:

```text
Database tables created successfully!
```

Start the backend **from the `backend` folder**:

```bash
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Check that the API is running:

- API: http://127.0.0.1:8000
- Interactive API documentation: http://127.0.0.1:8000/docs

Keep this terminal running.

### 3. Set up the frontend

Open a **second terminal** in the project root folder and run:

```bash
cd frontend
npm ci
npm run dev -- --host localhost --port 5173 --strictPort
```

Open **http://localhost:5173** in your browser.

**Use these exact local addresses and ports:** the frontend calls the API at `http://127.0.0.1:8000`, and the backend's CORS settings permit browser requests from `http://localhost:5173`.

### 4. Try JobTrack

1. Click **Create account** and register with your first name, last name, email, and password.
2. Log in with your new account.
3. Open **Add application** and create a sample entry, for example *Software Developer* at *Example Company*.
4. Open **Dashboard** to see application counts and select a status card to filter the list.
5. Open **Applications** to filter or sort applications. Select an application to view or edit its details, change its status, or delete it.

The database starts empty. There is **no preconfigured demo account or sample data**. Applications you create are stored in your local PostgreSQL database.

To stop the application, press **Ctrl+C** in each terminal.

## API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/auth/register` | Register a user |
| `POST` | `/auth/login` | Log in and receive a JWT |
| `GET` | `/auth/me` | Get the authenticated user's details |
| `GET` | `/applications` | List the user's applications |
| `POST` | `/applications` | Create an application |
| `GET` | `/applications/{application_id}` | Get one application |
| `PATCH` | `/applications/{application_id}` | Update an application |
| `DELETE` | `/applications/{application_id}` | Delete an application |
| `GET` | `/events` | List the user's calendar events |
| `POST` | `/events` | Create a calendar event |

The `/auth/me`, `/applications`, and `/events` endpoints require an `Authorization: Bearer <token>` header. The React frontend supplies this token for user information and job application requests.

## Current limitations

JobTrack is a work in progress. In the source version reviewed for this README:

- **Application search:** the search input is displayed, but its filtered results are not connected to the rendered list. Status filtering and sorting are implemented separately.
- **Calendar:** the calendar UI is present, but its event requests do not include the required JWT and existing events are not loaded on opening the calendar. Saving events through the browser therefore does not work with the current backend authorization.
- **Placeholder views:** *Forgot password?* and *Settings* do not have working implementations yet. Sidebar sections such as *To do*, *CV*, *Kanban*, and *Contacts* are also not implemented in the main view.
- **Session persistence:** the login token is stored in React state, so a page reload requires signing in again. Access tokens expire after 30 minutes.
- **Production build:** the local setup above uses Vite's development server. A clean production build/deployment has not been verified for this source version.

## Troubleshooting

- **`psql` is not recognized:** use pgAdmin instead, or add PostgreSQL's `bin` directory to your system's PATH.
- **Database connection fails:** make sure PostgreSQL is running, and check the username, password, port, and database name in `backend/.env`.
- **`ModuleNotFoundError` or a missing Python package:** activate the backend virtual environment and run `python -m pip install -r requirements.txt` again while in `backend/`.
- **`requirements.txt` not found:** confirm that the file is saved directly in `backend/` and that the terminal is in that folder.
- **Browser requests fail or show a CORS error:** open the frontend at `http://localhost:5173`, not `http://127.0.0.1:5173`. Ensure the API is running at `http://127.0.0.1:8000`.
- **Nothing appears on the dashboard:** register, log in, and create a job application. New databases contain no demo data.
- **Authentication stops working:** the JWT expires after 30 minutes. Log in again.

---

Created by **Isabella Katz** · 2026