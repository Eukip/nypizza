from rest_framework import viewsets

from accounts import permissions
from foods.models import FoodCategory
from foods.serializers.admin import AdminFoodCategorySerializer


class AdminCategoryViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides all actions for FoodCategory model.
    """
    queryset = FoodCategory.objects.all()
    serializer_class = AdminFoodCategorySerializer
    permission_classes = [permissions.IsAdministrator | permissions.IsOperator]
