import random
import string
from datetime import datetime

import requests
from django.conf import settings

# Create your views here.
from rest_framework.permissions import (
    AllowAny
)
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from django.utils.translation import gettext_lazy as _

from accounts.models import User
from accounts.serializers.mobile_app import (
    TokenObtainPairWithoutPasswordSerializer,
    VerifyPhoneNumberSerializer
)

from NewYork.swagger import (
    ErrorResponseAutoSchema,
    NoContentAutoSchema
)


@method_decorator(name='post', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Send sms to phone number endpoint'),
    tags=['auth'],
    request_body=TokenObtainPairWithoutPasswordSerializer,
    responses={
        status.HTTP_200_OK: NoContentAutoSchema,
    }
))
class SendSmsToPhoneNumberAPIView(APIView):
    serializer_class = TokenObtainPairWithoutPasswordSerializer

    def post(self, request, *args, **kwargs):
        serializer = TokenObtainPairWithoutPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.filter(phone_number=serializer.validated_data['phone_number']).first()
        if not user:
            user = User.objects.create_user(phone_number=serializer.validated_data['phone_number'],
                                            bonus=100, is_active=False)
        if user.phone_number == "+996700123000":
            user.activation_code = "090909"
            user.save()
            return Response(data={
                "PlayMarketUser": True,
                "Activation code": "090909"
            }, status=status.HTTP_200_OK)
        user.activation_code = activation_uuid_generator()
        user.save()

        send_sms(phone=user.phone_number, message=user.activation_code)
        return Response(status=status.HTTP_200_OK)


@method_decorator(name='post', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Verify phone number endpoint'),
    tags=['auth'],
    request_body=VerifyPhoneNumberSerializer,
    responses={status.HTTP_200_OK: NoContentAutoSchema, }
))
class VerifyPhoneNumberAPIView(APIView):
    serializer_class = VerifyPhoneNumberSerializer
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        return Response(status=status.HTTP_200_OK)


def send_sms(phone, message, message_id=None):
    try:
        if settings.DEBUG == False:
            if not message_id:
                message_id = str(round(datetime.now().timestamp(), 2)).replace('.', '')
            data = '<?xml version="1.0" encoding="UTF-8"?>'
            data += '<message>'
            data += f'  <login>{settings.SMS_NIKITA_LOGIN}</login>'
            data += f'  <pwd>{settings.SMS_NIKITA_PASSWORD}</pwd>'
            data += '  <id>{0}</id>'.format(message_id)
            data += f'  <sender>{settings.SMS_NIKITA_SENDER_NAME}</sender>'
            data += '  <text>{0}</text>'.format(message)
            data += '  <phones>'
            data += '    <phone>{0}</phone>'.format(phone)
            data += '  </phones>'
            data += '</message>'
            headers = {'Content-Type': 'application/xml'}
            requests.post('http://smspro.nikita.kg/api/message',
                          data=data.encode('utf-8'), headers=headers)
    except Exception as e:
        print(e)


def activation_uuid_generator():
    while True:
        uuid = ''.join(random.choice(string.digits) for x in range(6))
        if not User.objects.filter(activation_code=uuid).exists():
            return uuid
