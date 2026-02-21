from django.urls import path

from apps.consent.api.views import ConsentListCreateView, ConsentRevokeView

urlpatterns = [
    path("", ConsentListCreateView.as_view(), name="consent-list-create"),
    path("<uuid:consent_id>/revoke/", ConsentRevokeView.as_view(), name="consent-revoke"),
]
