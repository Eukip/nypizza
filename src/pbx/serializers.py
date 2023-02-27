from django.db import transaction
from rest_framework import serializers
from accounts.models import User
from accounts.serializers.mobile_app import UserRetrieveSerializer
from pbx.models import ATCall


class ATCallSerializer(serializers.ModelSerializer):
    client = UserRetrieveSerializer(required=False, read_only=True)

    class Meta:
        model = ATCall
        fields = '__all__'
        read_only_fields = ('id',)

    @transaction.atomic
    def create(self, validated_data):
        user = None
        user_filter = User.objects.filter(phone_number=validated_data['src']).first()
        if user_filter is not None:
            user = user_filter
        else:
            user = User.objects.create_user(phone_number=validated_data['src'])
        atc = ATCall.objects.create(
            call_id=validated_data['call_id'],
            link_id=validated_data['link_id'],
            direction=validated_data['direction'],
            call_status=validated_data['call_status'],
            start_time=validated_data['start_time'],
            end_time=validated_data['end_time'],
            duration=validated_data['duration'],
            src=validated_data['src'],
            dst=validated_data['dst'],
            recording_url=validated_data['recording_url'],
            client=user
        )
        return atc


class ATCallCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ATCall
        fields = (
            'id',
            'src',
            'dst',
            'call_id',
            'direction',
            'start_time',
            'end_time',
            'call_status',
            'duration',
            'recording_url',
            'link_id'
        )
        read_only_fields = ('id',)

    @transaction.atomic
    def create(self, validated_data):
        user = None
        user_filter = User.objects.filter(phone_number=validated_data['src']).first()
        if user_filter is not None:
            user = user_filter
        else:
            user = User.objects.create_user(phone_number=validated_data['src'])
        atc = ATCall.objects.create(
            **validated_data,
            client=user
        )
        return atc


class ATCallRetrieveUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ATCall
        fields = (
            "id",
            "end_time",
            "call_status",
            "duration",
            "recording_url",
            "link_id",
            "dst",
            "call_id",
            "start_time"
        )
        read_only_fields = ('id',)

    @transaction.atomic
    def update(self, instance, validated_data):
        instance.end_time = validated_data.get('end_time', instance.end_time)
        instance.call_status = validated_data.get('call_status', instance.call_status)
        instance.duration = validated_data.get('duration', instance.duration)
        instance.recording_url = validated_data.get('recording_url', instance.recording_url)
        instance.link_id = validated_data.get('link_id', instance.link_id)
        instance.dst = validated_data.get('dst', instance.dst)
        instance.start_time = validated_data.get('start_time', instance.start_time)
        instance.save()
        return instance


class ATCallGetListRetrieveSerializer(serializers.ModelSerializer):
    class Meta:
        model = ATCall
        fields = (
            "id",
            "src",
            "dst",
            "call_id",
            "direction",
            "start_time",
            "end_time",
            "call_status",
            "duration",
            "recording_url",
            "link_id",
            "created_at"
        )
        read_only_fields = ('id',)
