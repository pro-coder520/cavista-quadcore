"""
Field-level encryption utilities.
Wraps django-encrypted-model-fields for consistent usage across the project.
"""

from encrypted_model_fields.fields import (
    EncryptedCharField,
    EncryptedTextField,
)

__all__ = [
    "EncryptedCharField",
    "EncryptedTextField",
]
