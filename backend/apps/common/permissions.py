from rest_framework.permissions import BasePermission


class IsPatient(BasePermission):
    """Allow access only to users with the PATIENT role."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "PATIENT"
        )


class IsClinician(BasePermission):
    """Allow access only to users with the CLINICIAN role."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "CLINICIAN"
        )


class IsSponsor(BasePermission):
    """Allow access only to users with the SPONSOR role."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "SPONSOR"
        )


class IsAdmin(BasePermission):
    """Allow access only to users with the ADMIN role."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "ADMIN"
        )
