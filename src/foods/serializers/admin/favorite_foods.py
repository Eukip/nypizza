from rest_framework import serializers
from foods.models import FavoriteFood


class AdminBannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteFood
        fields = '__all__'
        read_only_fields = ('id', )
