from rest_framework.generics import ListAPIView

from apps.audit.api.serializers import AuditLogSerializer
from apps.audit.models.audit_log import AuditLog
from apps.common.permissions import IsAdmin


class AuditLogListView(ListAPIView):
    """Read-only list of audit logs. Admin access only."""

    serializer_class = AuditLogSerializer
    permission_classes = [IsAdmin]
    queryset = AuditLog.objects.all()
    filterset_fields = ["action", "resource_type", "user_id"]
