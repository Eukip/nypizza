from rest_framework import serializers

from foods.models import OrderSource


class SourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderSource
        fields = '__all__'
