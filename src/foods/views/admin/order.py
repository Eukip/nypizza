from rest_framework import viewsets
from rest_framework.generics import UpdateAPIView
from accounts import permissions
from foods.models import Order
from foods.serializers.admin import AdminOrderUpdateSerializer
from foods.serializers.admin.order import AdminOrderSerializer, AdminOrderCreateSerializer


class AdminOrderUpdateAPIView(UpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = AdminOrderUpdateSerializer
    permission_classes = [permissions.IsAdministrator | permissions.IsOperator]


class AdminOrderViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides all actions for Food model.
    """
    queryset = Order.objects.all().order_by('-id')
    serializer_class = AdminOrderSerializer
    permission_classes = [permissions.IsAdministrator | permissions.IsOperator]
    filterset_fields = {
        'created_at': ['gte', 'lte', 'exact', 'gt', 'lt'],
        'user__id': ['exact'],
        'status__name': ['exact'],
        'source__name': ['exact'],
        'payment_type__name': ['exact'],
        'type': ['exact']
    }


class APIOrderCreateAdminView(viewsets.ModelViewSet):
    serializer_class = AdminOrderCreateSerializer
    permission_classes = [permissions.IsAdministrator | permissions.IsOperator]
    queryset = Order.objects.all()

    def perform_create(self, serializer):
        serializer.save()
        if self.request.data['source'] != 2:
            serializer.save(operator=self.request.user)

    def perform_update(self, serializer):
        serializer.save()
        if (self.kwargs['pk']):
            object = Order.objects.get(pk=self.kwargs['pk'])
            if object.operator is None:
                serializer.save(operator=self.request.user)
