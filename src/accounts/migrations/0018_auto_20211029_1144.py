# Generated by Django 3.2.7 on 2021-10-29 05:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0017_auto_20211001_1447'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='status',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='users', to='accounts.userstatus', verbose_name='Статус'),
        ),
        migrations.AlterField(
            model_name='user',
            name='uuid',
            field=models.CharField(editable=False, max_length=6, unique=True, verbose_name='Уникальный код'),
        ),
    ]
