from datetime import date, datetime

import sqlalchemy
from sqlalchemy import Date, DateTime, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base

class User(Base):
    __tablename__= "users"
    
    id = sqlalchemy.Column(
        sqlalchemy.Integer,
        primary_key=True
    )
    
    email = sqlalchemy.Column(
        sqlalchemy.String(255),
        unique=True,
        nullable=False
    )
    
    # The users real password is never saved in the db, it is hashed
    hashed_password = sqlalchemy.Column(    
        sqlalchemy.String(255),
        nullable=False
    )
    
    # PostSQL automatically saves the time when the account is created
    created_at = sqlalchemy.Column(
        sqlalchemy.DateTime,
        server_default=sqlalchemy.func.now()
    )

class JobApplication(Base):
    __tablename__ = "job_applications"

# unique id for each job application (primary key)
    id: Mapped[int] = mapped_column(primary_key=True)

    company: Mapped[str] = mapped_column(String(200), nullable=False)
    job_title: Mapped[str] = mapped_column(String(200), nullable=False)

    location: Mapped[str | None] = mapped_column(String(200), nullable=True)
    job_url: Mapped[str | None] = mapped_column(Text, nullable=True)

    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    requirements: Mapped[str | None] = mapped_column(Text, nullable=True)

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="saved",
    )

    applied_date: Mapped[date | None] = mapped_column(Date, nullable=True)

    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

# When did I create this post in JobTrack, func.now() --> postgresql sets the time
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
    )

# any updates done with the application
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )