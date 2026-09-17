from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
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
):
    # mode_dump() = convert pydantic model into a standard Python dictionary
    application_data = application.model_dump()

    application_data["status"] = application.status.value

    # Pack up the data into a JobApplication model instance, which is compatible with SQLAlchemy
    db_application = JobApplication(**application_data)

    # Add the new application to the database
    db.add(db_application)
    # Commit the changes to the database and refresh the instance to get the updated data (like id, created_at, etc.)
    db.commit()
    db.refresh(db_application)

    return db_application

# GET applications endpoint
@app.get(
    "/applications", 
    response_model=list[JobApplicationResponse]
    )
# When a user does a GET request to the /applications endpoint, this function will be called. It will retrieve all job applications from the database and return them as a list of JobApplicationResponse objects.
def get_applications(db: Session = Depends(get_db)):
    # Select all job applications from the database, ordered by creation date in descending order
    statement = select(JobApplication).order_by(JobApplication.created_at.desc())
    # db.scalars(statement).all() executes the SQL query and returns all the results as a list of JobApplication objects. 
    # The scalars() method is used to 
    applications = db.scalars(statement).all()
    return applications

# GET application by ID endpoint
@app.get(
    "/applications/{application_id}",
    response_model=JobApplicationResponse,
)
def get_application(
    application_id: int, 
    db: Session = Depends(get_db),
):
    # Select the job application with the specified ID from the database
    application = db.get(JobApplication, application_id)
    
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
):
    application = db.get(JobApplication, application_id)
    
    if application is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )
   
   # exclude_unset=True = only include fields that were provided in the request body (not the ones that were left out)     
   # to avoid overwriting existing values in the database with None or default values
    update_data = application_update.model_dump(
        exclude_unset=True)
    
    if "status" in update_data and update_data["status"] is not None:
        update_data["status"] = update_data["status"].value
        
    for field, value in update_data.items():
        # set the attribute of the application object to the new value
        setattr(application, field, value)
    
    # commit() = save the changes to the database    
    db.commit()
    # refresh() = update the application object with the latest data from the database (like updated_at timestamp)
    db.refresh(application)
    
    return application

# DELETE application endpoint
@app.delete(
    # Retrieves the application_id from the URL path and passes it to the delete_application function as an argument. 
    # The function then uses this ID to find and delete the corresponding job application from the database.
    "/applications/{application_id}",
    # 204 = no content, the request was successful but there is no content to return
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_application(
    application_id: int,
    db: Session = Depends(get_db),
):
    application = db.get(JobApplication, application_id)
    
    if application is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )
    
    # delete the application from the database
    db.delete(application)
    db.commit()
    
    return None