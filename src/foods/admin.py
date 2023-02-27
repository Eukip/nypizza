from django.contrib import admin
from foods.models import (
    FoodCategory,
    Food,
    Order,
    OrderStatus,
    OrderSource,
    OrderFood,
    PaymentType,
    Banner,
    FavoriteFood
)
# Register your models here.

admin.site.register(FoodCategory)
admin.site.register(Food)
admin.site.register(Order)
admin.site.register(OrderStatus)
admin.site.register(OrderSource)
admin.site.register(OrderFood)
admin.site.register(PaymentType)
admin.site.register(Banner)
admin.site.register(FavoriteFood)

