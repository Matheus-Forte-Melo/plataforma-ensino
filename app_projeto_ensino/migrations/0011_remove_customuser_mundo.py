# Generated by Django 5.1.1 on 2024-10-23 19:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app_projeto_ensino', '0010_alter_customuser_cor_perfil'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='mundo',
        ),
    ]
