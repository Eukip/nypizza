from django.contrib import admin

# Register your models here.
from info.models import BonusesInfo, DostavkaInfo, Stocks, BonusTransaction

admin.site.register(BonusesInfo)
admin.site.register(DostavkaInfo)
admin.site.register(Stocks)
admin.site.register(BonusTransaction)