from app.database import Base, engine
from app import models


def init_db():
    # metadata.create_all() = full description of the db scheme
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    init_db()
    print("Database tables created successfully!")