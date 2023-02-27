from rest_framework import viewsets
from accounts import permissions
from foods.models import PaymentType
from foods.serializers.admin.payment_types import AdminPaymentsSerializer


class AdminUserPaymentsViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides all actions for Food model.
    """
    queryset = PaymentType.objects.all()
    serializer_class = AdminPaymentsSerializer
    permission_classes = [permissions.IsAdministrator | permissions.IsOperator]
