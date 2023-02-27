from rest_framework import serializers

from foods.models import PaymentType


class AdminPaymentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentType
        fields = '__all__'
        read_only_fields = ('id', )
