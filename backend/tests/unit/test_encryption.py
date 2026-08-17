from app.utils.encryption import TokenEncryptionService


def test_token_encryption_decryption():
    service = TokenEncryptionService()
    plaintext_token = "ya29.a0AfH6SMD_google_oauth_access_token_secret_12345"

    ciphertext = service.encrypt(plaintext_token)
    assert ciphertext != plaintext_token
    assert len(ciphertext) > len(plaintext_token)

    decrypted = service.decrypt(ciphertext)
    assert decrypted == plaintext_token


def test_empty_string_handling():
    service = TokenEncryptionService()
    assert service.encrypt("") == ""
    assert service.decrypt("") == ""
