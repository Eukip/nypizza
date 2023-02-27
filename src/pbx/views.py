from django.http import Http404
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from pbx.models import ATCall
from pbx.serializers import ATCallSerializer, ATCallCreateSerializer, ATCallRetrieveUpdateSerializer, \
    ATCallGetListRetrieveSerializer


class ATCViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides all actions for Food model.
    """
    queryset = ATCall.objects.all()
    serializer_class = ATCallSerializer
    # permission_classes = [permissions.IsAdministrator|permissions.IsOperator]
    permission_classes = (AllowAny, )


class ATCallCreateApiView(APIView):
    permission_classes = (AllowAny, )
    serializer_class = ATCallCreateSerializer

    def post(self, request, format=None, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ATCallRetrieveUpdateApiView(APIView):
    permission_classes = (AllowAny, )

    def get_object(self, link_id):
        try:
            return ATCall.objects.get(link_id=link_id)
        except ATCall.DoesNotExist:
            raise Http404

    def get(self, request, link_id, format=None, *args, **kwargs):
        call = self.get_object(link_id)
        serializer = ATCallGetListRetrieveSerializer(call)
        return Response(serializer.data)

    def patch(self, request, link_id, format=None):
        call = self.get_object(link_id)
        serializer = ATCallRetrieveUpdateSerializer(call, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ATCallListSearchApiView(APIView):
    permission_classes = (AllowAny, )

    def get(self, request, format=None, *args, **kwargs):
        if request.query_params:
            queryset = ATCall.objects.filter(link_id=request.query_params['link_id']).first()
            serializer = ATCallGetListRetrieveSerializer(queryset)
            return Response(serializer.data)
        return Response(data={'error': 'need add query params to search'}, status=status.HTTP_400_BAD_REQUEST)


class ATCallListApiView(APIView):
    permission_classes = (AllowAny, )

    def get(self, request, format=None, *args, **kwargs):
        queryset = ATCall.objects.all()
        serializer = ATCallGetListRetrieveSerializer(queryset, many=True)
        return Response(serializer.data)
