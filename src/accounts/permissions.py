from rest_framework.permissions import BasePermission
from django.contrib.auth.models import Group
from django.conf import settings


class IsAdministrator(BasePermission):
    def has_permission(self, request, view):
        if Group.objects.get(id=settings.ADMINISTRATOR_GROUP) in request.user.groups.all():
            return bool(request.user)


class IsOperator(BasePermission):
    def has_permission(self, request, view):
        if Group.objects.get(id=settings.OPERATOR_GROUP) in request.user.groups.all():
            return bool(request.user)
