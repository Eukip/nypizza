from rest_framework import viewsets

from info.models import DostavkaInfo, BonusesInfo, Stocks, BonusTransaction
from info.serializers import AdminDostavkaInfoSerializer, AdminBonusInfoSerializer, AdminStocksSerializer, \
    AdminBonusTransactionSerializer
from rest_framework.permissions import AllowAny
from accounts import permissions


class AdminDostavkaInfoViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides all actions for Food model.
    """
    queryset = DostavkaInfo.objects.all()
    serializer_class = AdminDostavkaInfoSerializer
    permission_classes = [AllowAny, ]


class AdminBonusesInfoViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides all actions for Food model.
    """
    queryset = BonusesInfo.objects.all()
    serializer_class = AdminBonusInfoSerializer
    permission_classes = [AllowAny, ]


class AdminStocksViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides all actions for Food model.
    """
    queryset = Stocks.objects.all()
    serializer_class = AdminStocksSerializer
    permission_classes = [AllowAny, ]


class AdminBonusesTransactionsViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides all actions for Food model.
    """
    queryset = BonusTransaction.objects.all().filter(bonus_used__isnull=False, bonus_added__isnull=False)
    serializer_class = AdminBonusTransactionSerializer
    permission_classes = [permissions.IsAdministrator | permissions.IsOperator]
    filterset_fields = {
        'created_at': ['gte', 'lte', 'exact', 'gt', 'lt'],
        'user__id': ['exact'],
    }
