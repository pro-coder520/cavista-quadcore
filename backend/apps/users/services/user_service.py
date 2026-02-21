from apps.users.models import User


class UserService:
    """
    Handles user profile business logic.
    """

    @staticmethod
    def get_profile(user: User) -> dict:
        """Return user profile data."""
        return {
            "id": str(user.id),
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role,
            "is_verified": user.is_verified,
            "mfa_enabled": user.mfa_enabled,
            "date_joined": user.date_joined.isoformat(),
        }

    @staticmethod
    def update_profile(user: User, data: dict) -> dict:
        """Update user profile fields."""
        allowed_fields = ["first_name", "last_name"]
        for field in allowed_fields:
            if field in data:
                setattr(user, field, data[field])

        user.save(update_fields=[f for f in allowed_fields if f in data] + ["updated_at"])
        return UserService.get_profile(user)
