from rest_framework import serializers
from foods.models import (
    Food,
    FoodCategory,
)


class FoodCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodCategory
        fields = (
            'id',
            'name',
        )


# Реестр отображения общего списка блюд содержит:
# Название блюда, Категория, Цена, Выход, Статус.
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
