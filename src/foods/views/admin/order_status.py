from rest_framework import viewsets
from accounts import permissions
from foods.models import OrderStatus
from foods.serializers.admin.order_status import AdminOrderStatusSerializer


class AdminOrderStatusViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides all actions for Food model.
    """
    queryset = OrderStatus.objects.all()
    serializer_class = AdminOrderStatusSerializer
    permission_classes = [permissions.IsAdministrator | permissions.IsOperator]
