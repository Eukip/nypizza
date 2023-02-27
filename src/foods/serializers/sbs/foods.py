from rest_framework import serializers
from foods.models import (
    Food,
    FoodCategory
)


class SBSFoodsSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=True)
    category = serializers.PrimaryKeyRelatedField(queryset=FoodCategory.objects.all(),
                                                  required=True)
    gram = serializers.IntegerField(required=False, min_value=0)
    price = serializers.IntegerField(required=True, min_value=0)
    description = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Food
        fields = (
            'id',
            'category',
            'name',
            'price',
            'gram',
            'is_deactivated',
            'desc',
            'description',
        )
        read_only_field = ('id', 'desc')

    def validate(self, attrs):
        attrs = super().validate(attrs)
        try:
            desc = attrs.pop('description')
            attrs['desc'] = desc
        finally:
            return attrs

    def create(self, validated_data):
        import re
        id = validated_data.pop('id')
        try:
            food = Food.objects.get(id=id)
            food = self.update(food, validated_data)
        except Exception:
            if re.search(r'\b' + 'Доставка' + r'\b', validated_data.pop('name')):
                pass
            else:
                food = Food.objects.create(id=id, **validated_data)
        return food

