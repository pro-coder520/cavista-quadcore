from rest_framework import serializers

from apps.consent.models.consent import ConsentRecord


class ConsentSerializer(serializers.ModelSerializer):
    """Serializer for consent records."""

    is_active = serializers.BooleanField(read_only=True)

    class Meta:
        model = ConsentRecord
        fields = [
            "id",
            "consent_type",
            "granted_at",
            "expires_at",
            "revoked_at",
            "ip_address",
            "electronic_signature",
            "version",
            "is_active",
        ]
        read_only_fields = [
            "id",
            "granted_at",
            "revoked_at",
            "ip_address",
            "is_active",
        ]


class GrantConsentSerializer(serializers.Serializer):
    """Serializer for granting consent."""

    consent_type = serializers.ChoiceField(choices=ConsentRecord.ConsentType.choices)
    electronic_signature = serializers.CharField(required=False, default="")
    expires_at = serializers.DateTimeField(required=False, allow_null=True)
    version = serializers.CharField(max_length=20, required=False, default="1.0")
