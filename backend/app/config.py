from pydantic_settings import BaseSettings, SettingsConfigDict

# pydantic - library to handle application configuration

# the Setting class (inherite from BaseSettings)
# is responsible for reading the configurations values from the .env-file
class Settings(BaseSettings):
    database_url: str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8"
    )

# creates an object so that python-files can write and use the db
# without knowing the password or .env
settings = Settings()