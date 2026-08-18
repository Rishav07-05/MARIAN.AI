from typing import List, Literal, Optional

from pydantic import Field, SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-[#0B0B0C]" if False else "utf-8",
        extra="ignore",
    )

    # Environment
    ENVIRONMENT: Literal["development", "testing", "production"] = "development"
    PROJECT_NAME: str = "MARIAN.AI Production Backend"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = False

    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    # Database
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/marian_db",
        description="Async PostgreSQL Connection String",
    )

    # Redis
    REDIS_URL: str = Field(
        default="redis://localhost:6379/0",
        description="Redis Connection String",
    )

    # Clerk Authentication
    CLERK_SECRET_KEY: SecretStr = Field(
        default=SecretStr("sk_test_mock_clerk_secret_key_for_dev_mode_only"),
        description="Clerk API Secret Key",
    )
    CLERK_JWKS_URL: str = Field(
        default="https://api.clerk.com/v1/jwks",
        description="Clerk JWKS URL for cryptographic JWT verification",
    )
    CLERK_ISSUER: str = Field(
        default="https://clerk.marian.ai",
        description="Expected Clerk JWT issuer claim",
    )

    # Google OAuth 2.0 & Calendar Integration
    GOOGLE_CLIENT_ID: str = Field(
        default="mock_google_client_id_for_dev",
        description="Google OAuth Client ID",
    )
    GOOGLE_CLIENT_SECRET: SecretStr = Field(
        default=SecretStr("mock_google_client_secret_for_dev"),
        description="Google OAuth Client Secret",
    )
    GOOGLE_REDIRECT_URI: str = Field(
        default="http://localhost:8000/api/v1/integrations/google/callback",
        description="Google OAuth Redirect Callback URI",
    )

    # Security & Encryption (Fernet Token Encryption Key)
    # Default is a valid 32-byte url-safe base64 key for development
    TOKEN_ENCRYPTION_KEY: SecretStr = Field(
        default=SecretStr("8s9XwM4J7Pq3vR5yZ1N6kL2tF0bH8gD3aE5cI7mO9uY="),
        description="Fernet 32-byte Base64 Encryption Key for OAuth tokens",
    )

    # MARIAN Inference Model Engine / Gemini API
    MARIAN_MODEL_URL: str = Field(
        default="http://localhost:8001",
        description="MARIAN Language Model Inference Server URL",
    )
    GEMINI_API_KEY: Optional[SecretStr] = Field(
        default=None,
        description="Google Gemini API Key for model inference",
    )
    GEMINI_MODEL: str = Field(
        default="gemini-3.6-flash",
        description="Google Gemini Model Name",
    )
    MAX_PROMPT_TOKENS: int = 8192
    MAX_RESPONSE_TOKENS: int = 4096

    # Rate Limiting (Requests Per Minute)
    RATE_LIMIT_STANDARD_RPM: int = 100
    RATE_LIMIT_CHAT_RPM: int = 20
    RATE_LIMIT_OAUTH_RPM: int = 10

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: str | List[str]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, list):
            return v
        return ["http://localhost:3000"]

    def validate_production_secrets(self) -> None:
        """Fail-fast validation for production environments."""
        if self.ENVIRONMENT == "production":
            if self.CORS_ORIGINS == ["*"]:
                raise ValueError("CORS_ORIGINS cannot be wildcard '*' in production.")
            if "mock" in self.CLERK_SECRET_KEY.get_secret_value():
                raise ValueError("CLERK_SECRET_KEY must be a valid production secret.")
            if "mock" in self.TOKEN_ENCRYPTION_KEY.get_secret_value():
                raise ValueError("TOKEN_ENCRYPTION_KEY must be configured for production.")


settings = Settings()
settings.validate_production_secrets()
