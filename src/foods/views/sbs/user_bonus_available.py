from rest_framework.views import APIView
from rest_framework.response import Response
from accounts.permissions import IsOperator, IsAdministrator
from foods.serializers.sbs import (
    SBSUSerAvailableBonusSerializer,
)
from rest_framework import status

from django.utils.translation import gettext_lazy as _
from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from NewYork.swagger import ErrorResponseAutoSchema


@method_decorator(name='post', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_("SBS get available bonus for user's order "),
    tags=['sbs'],
    responses={
        status.HTTP_200_OK: SBSUSerAvailableBonusSerializer,
    }
))
class APISBSUserOrderAvailableBonusView(APIView):
    serializer_class = SBSUSerAvailableBonusSerializer
    permission_classes = [IsOperator | IsAdministrator]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=200)
