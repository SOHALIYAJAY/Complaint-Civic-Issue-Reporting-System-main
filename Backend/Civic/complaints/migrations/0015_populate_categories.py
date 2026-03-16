from django.db import migrations


def create_categories(apps, schema_editor):
    ComplaintCategory = apps.get_model('complaints', 'ComplaintCategory')
    categories = [
        ('ROADS', 'Roads & Infrastructure'),
        ('TRAFFIC', 'Traffic & Road Safety'),
        ('WATER', 'Water Supply'),
        ('SEWERAGE', 'Sewerage & Drainage'),
        ('SANITATION', 'Sanitation & Garbage'),
        ('LIGHTING', 'Street Lighting'),
        ('PARKS', 'Parks & Public Spaces'),
        ('ANIMALS', 'Stray Animals'),
        ('ILLEGAL_CONSTRUCTION', 'Illegal Construction'),
        ('ENCROACHMENT', 'Encroachment'),
        ('PROPERTY_DAMAGE', 'Public Property Damage'),
        ('ELECTRICITY', 'Electricity & Power Issues'),
        ('OTHER', 'Other'),
    ]

    for code, label in categories:
        # create if not exists
        obj, created = ComplaintCategory.objects.get_or_create(
            name=code,
            defaults={'slug': code.lower(), 'description': label}
        )


class Migration(migrations.Migration):

    dependencies = [
        ('complaints', '0015_create_complaintcategory'),
    ]

    operations = [
        migrations.RunPython(create_categories, reverse_code=migrations.RunPython.noop),
    ]
