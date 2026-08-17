import base64

from cryptography.fernet import Fernet

from app.core.config import settings
from app.core.exceptions import MarianAPIException


class TokenEncryptionService:
    """Application-layer AES-128-CBC / HMAC token encryption using Fernet."""

    def __init__(self):
        raw_key = settings.TOKEN_ENCRYPTION_KEY.get_secret_value()
        try:
            # Ensure key is valid 32-byte url-safe base64 string
            if len(raw_key) != 44:
                key_bytes = raw_key.encode("utf-8").ljust(32, b"0")[:32]
                self.key = base64.urlsafe_b64encode(key_bytes)
            else:
                self.key = raw_key.encode("utf-8")
            self.fernet = Fernet(self.key)
        except Exception:
            dev_key = Fernet.generate_key()
            self.fernet = Fernet(dev_key)

    def encrypt(self, plaintext: str) -> str:
        if not plaintext:
            return ""
        return self.fernet.encrypt(plaintext.encode("utf-8")).decode("utf-8")

    def decrypt(self, ciphertext: str) -> str:
        if not ciphertext:
            return ""
        try:
            return self.fernet.decrypt(ciphertext.encode("utf-8")).decode("utf-8")
        except Exception as err:
            raise MarianAPIException(
                status_code=500,
                error_code="DECRYPTION_ERROR",
                message="Failed to decrypt authentication credentials",
            ) from err


encryption_service = TokenEncryptionService()
