from django.urls import path, include
from foods.views.admin.order import APIOrderCreateAdminView
from foods.views.website import (
    WebsiteAPIListFoodView,
    WebsiteAPIRetrieveFoodView,
    WebsiteAPIListFoodCategoryView,
)

foods = [
    path('', WebsiteAPIListFoodView.as_view(), name='website-food-list'),
    path('<int:pk>/', WebsiteAPIRetrieveFoodView.as_view(), name='website-food-detail'),
]
urlpatterns = [
    path('order/create/', APIOrderCreateAdminView.as_view({
        'post': 'create'
    })),
    path('', include(foods)),
    path('category/', WebsiteAPIListFoodCategoryView.as_view(),name='website-category-list'),
]
