"""Alter ComplaintAssignment.complaint field to match Complaint.comp_id PK type."""
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("complaints", "0011_remove_complaint_id_complaint_comp_id"),
    ]

    operations = [
        migrations.AlterField(
            model_name="complaintassignment",
            name="complaint",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="assignments",
                to="complaints.complaint",
            ),
        ),
    ]
