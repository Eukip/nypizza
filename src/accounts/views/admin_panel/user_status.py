from rest_framework import viewsets
from accounts import permissions
from accounts.models import UserStatus
from accounts.serializers.admin_panel.user_status import AdminUserStatusSerializer


class AdminUserStatusViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides all actions for Food model.
    """
    queryset = UserStatus.objects.all()
    serializer_class = AdminUserStatusSerializer
    permission_classes = [permissions.IsAdministrator | permissions.IsOperator]
