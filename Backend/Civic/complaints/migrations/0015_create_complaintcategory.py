from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('complaints', '0014_complaint_is_assignd'),
    ]

    operations = [
        migrations.CreateModel(
            name='ComplaintCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
                ('slug', models.SlugField(max_length=120, unique=True, blank=True)),
                ('description', models.TextField(blank=True)),
            ],
        ),
    ]
