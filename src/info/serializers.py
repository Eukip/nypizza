from rest_framework import serializers

from accounts.models import User
from info.models import DostavkaInfo, BonusesInfo, Stocks, BonusTransaction


class AdminDostavkaInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DostavkaInfo
        fields = '__all__'
        read_only_fields = ('id',)


class AdminBonusInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = BonusesInfo
        fields = '__all__'
        read_only_fields = ('id',)


class AdminStocksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stocks
        fields = '__all__'
        read_only_fields = ('id',)


class UserDetailBonusSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = (
            'id',
            'first_name',
            'phone_number',
        )


class AdminBonusTransactionSerializer(serializers.ModelSerializer):
    user = UserDetailBonusSerializer(read_only=True)
    order_sum = serializers.ReadOnlyField()

    class Meta:
        model = BonusTransaction
        fields = '__all__'
        read_only_fields = ('id',)
