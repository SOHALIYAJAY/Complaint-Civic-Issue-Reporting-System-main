from django.db import migrations, models


def forwards(apps, schema_editor):
    Complaint = apps.get_model('complaints', 'Complaint')
    ComplaintCategory = apps.get_model('complaints', 'ComplaintCategory')

    for c in Complaint.objects.all():
        try:
            old_val = getattr(c, 'Category')
        except AttributeError:
            old_val = None
        if not old_val:
            continue
        cat = ComplaintCategory.objects.filter(name=old_val).first()
        if cat:
            # set temporary FK field
            setattr(c, 'Category_new', cat)
            c.save()


def backwards(apps, schema_editor):
    Complaint = apps.get_model('complaints', 'Complaint')
    for c in Complaint.objects.all():
        # restore original string value from FK if available
        try:
            fk = getattr(c, 'Category')
        except AttributeError:
            fk = None
        if fk:
            try:
                name = fk.name
            except Exception:
                name = None
            if name:
                setattr(c, 'Category', name)
                c.save()


class Migration(migrations.Migration):

    dependencies = [
        ('complaints', '0015_populate_categories'),
    ]

    operations = [
        migrations.AddField(
            model_name='complaint',
            name='Category_new',
            field=models.ForeignKey(blank=True, null=True, on_delete=models.SET_NULL, to='complaints.ComplaintCategory'),
        ),
        migrations.RunPython(forwards, backwards),
        migrations.RemoveField(
            model_name='complaint',
            name='Category',
        ),
        migrations.RenameField(
            model_name='complaint',
            old_name='Category_new',
            new_name='Category',
        ),
    ]
