from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class RegisterSerializer(serializers.Serializer):
    """Serializer for user registration."""

    email = serializers.EmailField()
    password = serializers.CharField(min_length=8, write_only=True)
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)
    role = serializers.ChoiceField(
        choices=[("PATIENT", "Patient"), ("CLINICIAN", "Clinician"), ("SPONSOR", "Sponsor")]
    )


class LoginSerializer(serializers.Serializer):
    """Serializer for user login."""

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class TokenRefreshSerializer(serializers.Serializer):
    """Serializer for token refresh."""

    refresh = serializers.CharField()


class LogoutSerializer(serializers.Serializer):
    """Serializer for logout."""

    refresh = serializers.CharField()


class ProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile."""

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "role",
            "is_verified",
            "mfa_enabled",
            "date_joined",
        ]
        read_only_fields = ["id", "email", "role", "is_verified", "mfa_enabled", "date_joined"]


class ProfileUpdateSerializer(serializers.Serializer):
    """Serializer for profile updates."""

    first_name = serializers.CharField(max_length=150, required=False)
    last_name = serializers.CharField(max_length=150, required=False)


class UserResponseSerializer(serializers.Serializer):
    """Serializer for user data in responses."""

    id = serializers.UUIDField()
    email = serializers.EmailField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    role = serializers.CharField()


class AuthResponseSerializer(serializers.Serializer):
    """Serializer for auth responses containing user + tokens."""

    user = UserResponseSerializer()
    tokens = serializers.DictField()
