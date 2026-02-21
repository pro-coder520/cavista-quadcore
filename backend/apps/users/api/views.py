from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.audit.services.audit_service import AuditService
from apps.users.api.serializers import (
    LoginSerializer,
    LogoutSerializer,
    ProfileSerializer,
    ProfileUpdateSerializer,
    RegisterSerializer,
    TokenRefreshSerializer,
)
from apps.users.services.auth_service import AuthService
from apps.users.services.user_service import UserService


class RegisterView(APIView):
    """Register a new user account."""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            result = AuthService.register(**serializer.validated_data)
            AuditService.log_action(
                user_id=result["user"]["id"],
                action="CREATE",
                resource_type="User",
                resource_id=result["user"]["id"],
                ip_address=self._get_client_ip(request),
                user_agent=request.META.get("HTTP_USER_AGENT", ""),
                changes={"email": result["user"]["email"], "role": result["user"]["role"]},
            )
            return Response(result, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def _get_client_ip(request):
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            return x_forwarded_for.split(",")[0].strip()
        return request.META.get("REMOTE_ADDR")


class LoginView(APIView):
    """Authenticate and obtain JWT tokens."""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            result = AuthService.login(**serializer.validated_data)
            AuditService.log_action(
                user_id=result["user"]["id"],
                action="LOGIN",
                resource_type="User",
                resource_id=result["user"]["id"],
                ip_address=RegisterView._get_client_ip(request),
                user_agent=request.META.get("HTTP_USER_AGENT", ""),
            )
            return Response(result, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    """Blacklist refresh token to log out."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            AuthService.logout(serializer.validated_data["refresh"])
            AuditService.log_action(
                user_id=str(request.user.id),
                action="LOGOUT",
                resource_type="User",
                resource_id=str(request.user.id),
                ip_address=RegisterView._get_client_ip(request),
                user_agent=request.META.get("HTTP_USER_AGENT", ""),
            )
            return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class TokenRefreshView(APIView):
    """Refresh JWT access token."""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = TokenRefreshSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            tokens = AuthService.refresh(serializer.validated_data["refresh"])
            return Response(tokens, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)


class ProfileView(APIView):
    """Retrieve and update user profile."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = UserService.get_profile(request.user)
        return Response(profile, status=status.HTTP_200_OK)

    def patch(self, request):
        serializer = ProfileUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        profile = UserService.update_profile(request.user, serializer.validated_data)
        AuditService.log_action(
            user_id=str(request.user.id),
            action="UPDATE",
            resource_type="User",
            resource_id=str(request.user.id),
            ip_address=RegisterView._get_client_ip(request),
            user_agent=request.META.get("HTTP_USER_AGENT", ""),
            changes=serializer.validated_data,
        )
        return Response(profile, status=status.HTTP_200_OK)
