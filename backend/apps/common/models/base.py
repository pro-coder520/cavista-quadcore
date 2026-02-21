import uuid

from django.conf import settings
from django.db import models


class BaseModel(models.Model):
    """
    Abstract base model providing UUID primary key, timestamps,
    soft-delete, and creator/updater tracking.
    All models in the project should inherit from this.
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False, db_index=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="%(class)s_created",
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="%(class)s_updated",
    )

    class Meta:
        abstract = True
        ordering = ["-created_at"]

    def soft_delete(self):
        """Mark record as deleted without removing from database."""
        self.is_deleted = True
        self.save(update_fields=["is_deleted", "updated_at"])
