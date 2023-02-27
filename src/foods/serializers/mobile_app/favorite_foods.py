from rest_framework import serializers
from rest_framework.fields import CurrentUserDefault

from foods.models import (
    FavoriteFood
)


class FavoriteFoodSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=CurrentUserDefault())

    class Meta:
        model = FavoriteFood
        fields = '__all__'

        read_only_fields = ('id', 'user')

    def create(self, validated_data):
        return FavoriteFood.objects.get_or_create(**validated_data)[0]
