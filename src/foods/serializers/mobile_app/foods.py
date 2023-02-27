from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from foods.models import (
    Food,
    FoodCategory,
    FavoriteFood, OrderFood
)


class FoodCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodCategory
        fields = (
            'id',
            'name',
        )


# Реестр отображения общего списка блюд содержит: Название блюда, Категория, Цена, Выход, Статус.
class FoodsSerializer(serializers.ModelSerializer):
    category = FoodCategorySerializer()
    is_favorite = serializers.SerializerMethodField('get_is_favorite')
    quantity_in_basket = serializers.SerializerMethodField('get_quantity_in_basket')

    class Meta:
        model = Food
        fields = (
            'id',
            'name',
            'image',
            'category',
            'price',
            'desc',
            'gram',
            'is_deactivated',
            'is_favorite',
            'quantity_in_basket',
        )
        read_only_fields = ('id',)

    def get_user(self):
        request = self.context.get('request', None)
        if request and hasattr(request, "user"):
            request_user = request.user
        else:
            raise serializers.ValidationError({'user': _('Пользователь не авторизовался')})

        return request_user

    def get_is_favorite(self, obj):
        try:
            user = self.get_user()
        except Exception:
            return False
        if user.is_anonymous:
            return False
        return FavoriteFood.objects.filter(user=user, food=obj).exists()

    def get_quantity_in_basket(self, obj):
        try:
            user = self.get_user()
        except Exception:
            return 0
        if user.is_anonymous:
            return 0
        if OrderFood.objects.filter(user=user, order=None, food=obj).exists():
            return OrderFood.objects.filter(user=user, order=None, food=obj).first().amount
        return 0


class FoodDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Food
        fields = '__all__'
        read_only_fields = ('id', 'is_deactivated', 'is_popular')
