from rest_framework import viewsets
from accounts.models import Address
from accounts.serializers.admin_panel.addresses import AdminWebsiteAddressSerializer
from accounts.permissions import IsOperator, IsAdministrator


class AdminUserAddressViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides all actions for Food model.
    """
    queryset = Address.objects.all()
    serializer_class = AdminWebsiteAddressSerializer
    permission_classes = [IsOperator | IsAdministrator]
    filter_fields = ('user__id', )
