from rest_framework import serializers
from foods.models import Banner


class AdminBannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = '__all__'
        read_only_fields = ('id', )
