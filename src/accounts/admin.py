from django.contrib import admin
from accounts.models import (
    User,
    UserStatus,
    Address,
    WebsiteUser,
)
# Register your models here.


class UserAdmin(admin.ModelAdmin):
    readonly_fields = ('id', 'password', 'uuid')


admin.site.register(User, UserAdmin)
admin.site.register(UserStatus)
admin.site.register(Address)
admin.site.register(WebsiteUser)

