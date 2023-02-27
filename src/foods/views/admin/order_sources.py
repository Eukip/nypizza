from rest_framework import viewsets
from accounts import permissions
from foods.models import OrderSource
from foods.serializers.admin.order_sources import AdminOrderSourceSerializer


class AdminOrderSourceViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides all actions for Food model.
    """
    queryset = OrderSource.objects.all()
    serializer_class = AdminOrderSourceSerializer
    permission_classes = [permissions.IsAdministrator | permissions.IsOperator]
