from rest_framework import serializers

from apps.audit.models.audit_log import AuditLog


class AuditLogSerializer(serializers.ModelSerializer):
    """Read-only serializer for audit logs."""

    class Meta:
        model = AuditLog
        fields = [
            "id",
            "user_id",
            "action",
            "resource_type",
            "resource_id",
            "ip_address",
            "user_agent",
            "timestamp",
            "changes",
            "electronic_signature",
        ]
        read_only_fields = fields
