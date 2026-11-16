from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.security import (
    hash_password, 
    verify_password,
    create_access_token,
    get_current_user,
)
from app.models import JobApplication
from app.schemas import (
    JobApplicationCreate, 
    JobApplicationResponse,
    JobApplicationUpdate,
)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    # The backend allows requests from the frontend running on http://localhost:5173 (the default port for Vite development server)
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    # allows all HTTP methods (GET, POST, PUT, DELETE, etc.) and headers to be sent in requests from the frontend
    allow_methods=["*"],
    # allows all HTTP-headers to be sent in requests from the frontend (will be added later)
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Oh yeah, JobTrack API is running!"}

# (POST) Endpoint for Register new user
@app.post(
    "/auth/register",
    response_model=schemas.UserResponse,
    status_code=status.HTTP_201_CREATED
)
def register_user(
    user_data: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    existing_user = (
        db.query(models.User)
        .filter(models.User.email == user_data.email)
        .first()
    )
    
    # Does not allow registration with a mail that is already registered
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_password = hash_password(user_data.password)
    
    new_user = models.User(
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        email=user_data.email,
        hashed_password=hashed_password
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
        
    return new_user

### (POST) Endpoint for Login ###
@app.post(
    "/auth/login",
    response_model=schemas.TokenResponse,
)
def login_user(
    login_data: schemas.UserLogin,
    db: Session = Depends(get_db),
):
    user = (
        db.query(models.User)
        .filter(models.User.email == login_data.email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    password_is_valid = verify_password(
        login_data.password,
        user.hashed_password,
    )

    if not password_is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access_token = create_access_token(user.id)

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }

# POST application endpoint
@app.post(
    "/applications",
    response_model=JobApplicationResponse,
    # 201 = resource created successfully
    status_code=status.HTTP_201_CREATED,
)
def create_application(
    application: JobApplicationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Convert Pydantic model into a Python dictionary
    application_data = application.model_dump()

    application_data["status"] = application.status.value

    # Connect the application to the logged-in user
    application_data["user_id"] = current_user.id

    # Create SQLAlchemy model instance
    db_application = JobApplication(**application_data)

    db.add(db_application)
    db.commit()
    db.refresh(db_application)

    return db_application

# GET applications endpoint
# GET applications endpoint
@app.get(
    "/applications",
    response_model=list[JobApplicationResponse],
)
def get_applications(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Only retrieve applications belonging to the logged-in user
    statement = (
        select(JobApplication)
        .where(
            JobApplication.user_id == current_user.id
        )
        .order_by(
            JobApplication.created_at.desc()
        )
    )

    applications = db.scalars(statement).all()

    return applications

@app.get(
    "/applications/{application_id}",
    response_model=JobApplicationResponse,
)
def get_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    statement = select(JobApplication).where(
        JobApplication.id == application_id,
        JobApplication.user_id == current_user.id,
    )

    application = db.scalars(statement).first()

    if application is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )

    return application

@app.patch(
    "/applications/{application_id}",
    response_model=JobApplicationResponse,
)
def update_application(
    application_id: int,
    application_update: JobApplicationUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    statement = select(JobApplication).where(
        JobApplication.id == application_id,
        JobApplication.user_id == current_user.id,
    )

    application = db.scalars(statement).first()

    if application is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )

    # Only include fields provided in the request
    update_data = application_update.model_dump(
        exclude_unset=True
    )

    if (
        "status" in update_data
        and update_data["status"] is not None
    ):
        update_data["status"] = update_data["status"].value

    for field, value in update_data.items():
        setattr(application, field, value)

    db.commit()
    db.refresh(application)

    return application

# DELETE application endpoint
# DELETE application endpoint
@app.delete(
    "/applications/{application_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    statement = select(JobApplication).where(
        JobApplication.id == application_id,
        JobApplication.user_id == current_user.id,
    )

    application = db.scalars(statement).first()

    if application is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )

    db.delete(application)
    db.commit()

    return None

### CALENDAR ###

# Create a new event in calendar #
@app.post(
    "/events",
    response_model=schemas.CalendarEventResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_event(
    event_data: schemas.CalendarEventCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    new_event = models.CalendarEvent(
        title=event_data.title,
        event_date=event_data.event_date,
        start_time=event_data.start_time,
        notes=event_data.notes,

        user_id=current_user.id,
    )

    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    return new_event

# Get all events for the logged-in user 
@app.get(
    "/events",
    response_model=list[schemas.CalendarEventResponse],
)
def get_events(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    statement = (
        select(models.CalendarEvent)
        .where(
            models.CalendarEvent.user_id == current_user.id
        )
        .order_by(
            models.CalendarEvent.event_date
        )
    )

    events = db.scalars(statement).all()

    return events
    
# Delete event from calendar - will be implemented
# Update/change event in calendar - will be implemented
