from datetime import date, datetime
from enum import Enum

from pydantic import BaseModel, EmailStr, ConfigDict, Field

# Data from when a user register
class UserCreate(BaseModel):
    email: EmailStr
    password: str

# Data sending back 
class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True) 
    id: int
    email: EmailStr



class ApplicationStatus(str, Enum):
    saved = "saved"
    applied = "applied"
    screening = "screening"
    interview = "interview"
    offer = "offer"
    rejected = "rejected"
    withdrawn = "withdrawn"


# When creating a new job application. (POST)
class JobApplicationCreate(BaseModel):
    company: str = Field(min_length=1, max_length=200)
    job_title: str = Field(min_length=1, max_length=200)

    location: str | None = Field(default=None, max_length=200)
    job_url: str | None = None

    description: str | None = None
    requirements: str | None = None

    status: ApplicationStatus = ApplicationStatus.saved
    applied_date: date | None = None

    notes: str | None = None

# When updating an existing job application. (PATCH)    
class JobApplicationUpdate(BaseModel):
    company: str | None = Field(default=None, min_length=1, max_length=200)
    job_title: str | None = Field(default=None, min_length=1, max_length=200)

    location: str | None = Field(default=None, max_length=200)
    job_url: str | None = None

    description: str | None = None
    requirements: str | None = None

    status: ApplicationStatus | None = None
    applied_date: date | None = None

    notes: str | None = None

# This class inherite all columns from JobApplicationCreate
class JobApplicationResponse(JobApplicationCreate):
    # Important to not cause a conflict with the database columns, we need to set the model_config to from_attributes=True
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime