from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from apps.users.models import User


class AuthService:
    """
    Handles all authentication business logic.
    Views should delegate to this service — no business logic in views.
    """

    @staticmethod
    def register(email: str, password: str, first_name: str, last_name: str, role: str) -> dict:
        """Register a new user and return JWT tokens."""
        if User.objects.filter(email=email).exists():
            raise ValueError("A user with this email already exists.")

        valid_roles = [choice[0] for choice in User.Role.choices if choice[0] != "ADMIN"]
        if role not in valid_roles:
            raise ValueError(f"Invalid role. Must be one of: {', '.join(valid_roles)}")

        user = User.objects.create_user(
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            role=role,
        )

        tokens = AuthService._generate_tokens(user)
        return {
            "user": {
                "id": str(user.id),
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role,
            },
            "tokens": tokens,
        }

    @staticmethod
    def login(email: str, password: str) -> dict:
        """Authenticate user and return JWT tokens."""
        user = authenticate(email=email, password=password)
        if user is None:
            raise ValueError("Invalid email or password.")
        if not user.is_active:
            raise ValueError("This account has been deactivated.")

        tokens = AuthService._generate_tokens(user)
        return {
            "user": {
                "id": str(user.id),
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role,
            },
            "tokens": tokens,
        }

    @staticmethod
    def logout(refresh_token: str) -> None:
        """Blacklist the refresh token to log the user out."""
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            raise ValueError("Invalid or expired refresh token.")

    @staticmethod
    def refresh(refresh_token: str) -> dict:
        """Generate new access token from refresh token."""
        try:
            token = RefreshToken(refresh_token)
            return {
                "access": str(token.access_token),
                "refresh": str(token),
            }
        except Exception:
            raise ValueError("Invalid or expired refresh token.")

    @staticmethod
    def _generate_tokens(user: User) -> dict:
        """Generate JWT access and refresh tokens for a user."""
        refresh = RefreshToken.for_user(user)
        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }
