# Generated by Django 3.2.7 on 2021-11-22 04:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('info', '0002_auto_20211111_1243'),
    ]

    operations = [
        migrations.CreateModel(
            name='Stocks',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200, verbose_name='Навание Акции')),
                ('description', models.TextField(verbose_name='Описание акции')),
                ('image', models.ImageField(blank=True, null=True, upload_to='stocks', verbose_name='Картинка акции')),
                ('is_active', models.BooleanField(default=False, verbose_name='Активность акции')),
            ],
        ),
    ]