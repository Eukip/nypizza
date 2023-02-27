from django.urls import include, path
from rest_framework.routers import DefaultRouter

from pbx.views import ATCViewSet, ATCallCreateApiView, \
    ATCallRetrieveUpdateApiView, ATCallListApiView, ATCallListSearchApiView

router = DefaultRouter()
router.register(r'pbx-call', ATCViewSet)


urlpatterns = [
    path('admin/', include(router.urls)),
    path('', ATCallListApiView.as_view(), name='list-pbx-call'),
    path('search/', ATCallListSearchApiView.as_view(), name='search-call-byl-link-id'),
    path('incoming/', ATCallCreateApiView.as_view(), name='create-pbx-call'),
    path('-<str:link_id>/', ATCallRetrieveUpdateApiView.as_view(), name='update-pbx-call-by-call-id'),
]