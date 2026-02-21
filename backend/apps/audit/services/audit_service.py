from apps.audit.models.audit_log import AuditLog


class AuditService:
    """
    Single entry point for writing audit logs.
    All mutations in the system should call this service.
    """

    @staticmethod
    def log_action(
        user_id: str,
        action: str,
        resource_type: str,
        resource_id: str,
        ip_address: str = None,
        user_agent: str = "",
        changes: dict = None,
        electronic_signature: str = "",
    ) -> AuditLog:
        """Create an immutable audit log entry."""
        return AuditLog.objects.create(
            user_id=user_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            ip_address=ip_address,
            user_agent=user_agent,
            changes=changes or {},
            electronic_signature=electronic_signature,
        )
