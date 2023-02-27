"""NewYork URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Snippets API",
        default_version='v1',
        description="Test description",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@snippets.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

mobile_urls = [
    path('accounts/', include('accounts.urls.mobile_app')),
    path('foods/', include('foods.urls.mobile_app')),
    path('info/', include('info.urls'))
]
sbs_urls = [
    path('accounts/', include('accounts.urls.sbs')),
    path('foods/', include('foods.urls.sbs')),
]
admin_urls = [
    path('', include('accounts.urls.admin_panel')),
    path('foods/', include('foods.urls.admin'))
]
website_urls = [
    path('accounts/', include('accounts.urls.website')),
    path('foods/', include('foods.urls.website'))
]

info_urls = [
    path('info/', include('info.urls')),
]

atc_urls = [
    path('pbx/', include('pbx.urls'))
]

api_v1 = [
    path('v1/mobile_app/', include(mobile_urls)),
    path('v1/sbs/', include(sbs_urls)),
    path('v1/admin/', include(admin_urls)),
    path('v1/website/', include(website_urls)),
    path('v1/', include(info_urls)),
    path('v1/', include(atc_urls)),

]

urlpatterns = [
                  path('admin/', admin.site.urls),
                  path('api/', include(api_v1)),
                  path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='swagger'),

              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
