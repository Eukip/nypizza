import datetime


def create_report_object(
        user,
        bonus_used,
        bonus_added,
        order
):
    from info.models import BonusTransaction
    from foods.models import Order
    report = BonusTransaction.objects.create(
        user=user,
        bonus_used=bonus_used,
        bonus_added=bonus_added,
        order=Order.objects.get(id=order),
    )
    return report
