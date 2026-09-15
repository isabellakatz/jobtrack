from sqlalchemy import create_engine
# session maker allows us to work with different sessiont (INSERT, SELECT, UPDATE, DELETE)
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from app.config import settings

# function to create SQLAlchemy connection to the database

engine = create_engine(settings.database_url)

# Each time we need to communicate with the database - create a new session via SessionLocal()
SessionLocal = sessionmaker(
    bind=engine,
    # gives more control over the sql-operations sent to the db
    autoflush=False,
    # sqlalchemy should not automatically make permanent changes (before a sessions is done)
    autocommit=False,
)


class Base(DeclarativeBase):
    pass