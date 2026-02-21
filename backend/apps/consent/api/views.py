from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.consent.api.serializers import ConsentSerializer, GrantConsentSerializer
from apps.consent.services.consent_service import ConsentService


class ConsentListCreateView(APIView):
    """List user consents and grant new consent."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        consents = ConsentService.get_user_consents(request.user)
        serializer = ConsentSerializer(consents, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = GrantConsentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        ip_address = self._get_client_ip(request)

        try:
            consent = ConsentService.grant_consent(
                user=request.user,
                ip_address=ip_address,
                **serializer.validated_data,
            )
            return Response(
                ConsentSerializer(consent).data,
                status=status.HTTP_201_CREATED,
            )
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def _get_client_ip(request):
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            return x_forwarded_for.split(",")[0].strip()
        return request.META.get("REMOTE_ADDR")


class ConsentRevokeView(APIView):
    """Revoke a specific consent record."""

    permission_classes = [IsAuthenticated]

    def post(self, request, consent_id):
        ip_address = ConsentListCreateView._get_client_ip(request)

        try:
            consent = ConsentService.revoke_consent(
                consent_id=consent_id,
                user=request.user,
                ip_address=ip_address,
            )
            return Response(
                ConsentSerializer(consent).data,
                status=status.HTTP_200_OK,
            )
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
