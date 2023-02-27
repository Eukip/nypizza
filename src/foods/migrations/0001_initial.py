# Generated by Django 3.2.7 on 2021-09-03 08:57

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='FoodCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128, verbose_name='Название')),
                ('ordering', models.PositiveIntegerField(blank=True, null=True, verbose_name='Очередь')),
                ('cover_file', models.ImageField(blank=True, null=True, upload_to='FoodCategory', verbose_name='Обложка')),
            ],
        ),
        migrations.CreateModel(
            name='Food',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=256, verbose_name='Название')),
                ('image', models.ImageField(blank=True, null=True, upload_to='foods', verbose_name='Картинка')),
                ('desc', models.TextField(blank=True, max_length=2048, null=True, verbose_name='Описание')),
                ('gram', models.PositiveIntegerField(default=0, verbose_name='Граммаж')),
                ('price', models.PositiveIntegerField(default=0, verbose_name='Цена')),
                ('is_deactivated', models.BooleanField(default=False, verbose_name='Блюдо деактивировано')),
                ('is_popular', models.BooleanField(default=False, verbose_name='Блюдо популярное')),
                ('category', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='foods', to='foods.foodcategory', verbose_name='Категория')),
            ],
            options={
                'verbose_name': 'Блюдо',
                'verbose_name_plural': 'Блюда',
            },
        ),
    ]