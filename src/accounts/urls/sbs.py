from django.urls import path

from accounts.views.sbs import (
    SBSTokenObtainPairView,
)

urlpatterns = [
    path('token/', SBSTokenObtainPairView.as_view(), name='sbs-token'),
]