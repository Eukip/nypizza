from rest_framework import serializers

from accounts.models import WebsiteUser


class WebsiteUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsiteUser
        fields = '__all__'
        read_only_fields = ('id', 'order')
