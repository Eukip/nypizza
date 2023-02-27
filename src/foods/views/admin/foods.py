from rest_framework import viewsets
from accounts import permissions
from foods.models import Food
from foods.serializers.admin import AdminFoodSerializer
from foods.serializers.admin.foods import AdminFoodCreateSerializer


class AdminFoodViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides all actions for Food model.
    """
    queryset = Food.objects.all().order_by('id')
    serializer_class = AdminFoodSerializer
    permission_classes = [permissions.IsAdministrator | permissions.IsOperator]
    filter_fields = ('category__id', 'is_popular')


class AdminFoodCreateViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides all actions for Food model.
    """
    queryset = Food.objects.all().order_by('id')
    serializer_class = AdminFoodCreateSerializer
    permission_classes = [permissions.IsAdministrator | permissions.IsOperator]
    filter_fields = ('category__id', 'is_popular')
