from rest_framework.generics import ListAPIView
from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from rest_framework.pagination import PageNumberPagination
from django.utils.translation import gettext_lazy as _
from rest_framework.response import Response
from rest_framework.views import APIView

from NewYork.swagger import ErrorResponseAutoSchema
from drf_yasg import openapi
from rest_framework import status, viewsets

from accounts import permissions
from accounts.models import User
from accounts.permissions import IsAdministrator
from accounts.serializers.admin_panel.clients import AdminMobileAppUsersListRetrieve, \
    AdminOperatorUserListSerializer, AdminOperatorUserCreateSerializer, \
    UserDetailOrderHistorySerializer, AdminOperatorUserUpdateSerializer, AdminAdministratorsUserUpdateSerializer


class Custom10Pagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


@method_decorator(name='get', decorator=swagger_auto_schema(
    auto_schema=ErrorResponseAutoSchema,
    operation_id=_('Get users list operators '),
    tags=['admin'],
    manual_parameters=[openapi.Parameter('operator', openapi.IN_QUERY,
                                         description='operator=operator_id ',
                                         type=openapi.TYPE_STRING),
                       ],
    responses={
        status.HTTP_200_OK: AdminOperatorUserListSerializer,
    }
))
class APIListOperatorView(ListAPIView):
    serializer_class = AdminOperatorUserListSerializer
    permission_classes = (IsAdministrator,)
    pagination_class = Custom10Pagination
    model = User

    def get_queryset(self):
        qs = User.objects.filter(groups__name='Оператор')
        return qs


class AdminClientsViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides all actions for Food model.
    """
    queryset = User.objects.all()
    serializer_class = AdminMobileAppUsersListRetrieve
    permission_classes = [permissions.IsAdministrator | permissions.IsOperator]


class AdminOperatorsListCreateApiView(APIView):
    permission_classes = [permissions.IsAdministrator | permissions.IsOperator]

    def get(self, request, format=None, *args, **kwargs):
        queryset = User.objects.filter(groups__id=2)
        serializer = AdminOperatorUserCreateSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request, format=None, *args, **kwargs):
        try:
            from django.contrib.auth.models import Group
            print("post started")
            group = Group.objects.get(id=2)
            user, created = User.objects.get_or_create(
                phone_number=request.data['phone_number'],
            )
            user.set_password(request.data['password'])
            user.groups.add(group)
            user.first_name = request.data['first_name']
            user.save()
            data = {
                "id": user.id,
                "first_name": request.data['first_name'],
                "phone_number": request.data['phone_number']
            }
            if created:
                return Response(data, status=status.HTTP_201_CREATED)
            if not created:
                return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e), status=status.HTTP_409_CONFLICT)


class AdminOperatorsUpdateViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides all actions for Food model.
    """
    queryset = User.objects.filter(groups__id=2)
    serializer_class = AdminOperatorUserUpdateSerializer
    permission_classes = [permissions.IsAdministrator | permissions.IsOperator]


class AdminAdministratorsListCreateApiView(APIView):
    permission_classes = [permissions.IsAdministrator | permissions.IsOperator]

    def get(self, request, format=None, *args, **kwargs):
        queryset = User.objects.filter(groups__id=1)
        serializer = AdminOperatorUserCreateSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request, format=None, *args, **kwargs):
        try:
            from django.contrib.auth.models import Group
            print("post started")
            group = Group.objects.get(id=1)
            user, created = User.objects.get_or_create(
                phone_number=request.data['phone_number'],
            )
            user.set_password(request.data['password'])
            user.first_name = request.data['first_name']
            user.groups.add(group)
            user.save()
            data = {
                "id": user.id,
                "first_name": request.data['first_name'],
                "phone_number": request.data['phone_number']
            }
            if created:
                return Response(data, status=status.HTTP_201_CREATED)
            if not created:
                return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e), status=status.HTTP_409_CONFLICT)


class AdminAdministratorsUpdateViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides all actions for Food model.
    """
    queryset = User.objects.filter(groups__id=1)
    serializer_class = AdminAdministratorsUserUpdateSerializer
    permission_classes = [permissions.IsAdministrator | permissions.IsOperator]


class APIRetrieveUserHistoryView(viewsets.ModelViewSet):
    """
    This viewset automatically provides all actions for Food model.
    """
    queryset = User.objects.all()
    serializer_class = UserDetailOrderHistorySerializer
    permission_classes = [permissions.IsAdministrator | permissions.IsOperator]
