from django.urls import path

from apps.users.api.views import (
    LoginView,
    LogoutView,
    ProfileView,
    RegisterView,
    TokenRefreshView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="auth-register"),
    path("login/", LoginView.as_view(), name="auth-login"),
    path("logout/", LogoutView.as_view(), name="auth-logout"),
    path("token/refresh/", TokenRefreshView.as_view(), name="auth-token-refresh"),
    path("profile/", ProfileView.as_view(), name="auth-profile"),
]
