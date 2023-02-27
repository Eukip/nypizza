from rest_framework.serializers import ModelSerializer
from accounts.models import UserStatus


class AdminUserStatusSerializer(ModelSerializer):
    class Meta:
        model = UserStatus
        fields = '__all__'
        read_only_fields = ('id', )
