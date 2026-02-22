from django.db import models

class report(models.Model):
    CHOICE_SUBJECT=(
        ('general','General Inquiry'),
        ('complaint','Complaint Report'),
        ('eedback','Feedback')
        )
    full_name=models.CharField(max_length=30)
    email=models.EmailField(unique=True)
    phone_number=models.CharField(max_length=10)
    subject=models.CharField(choices=CHOICE_SUBJECT)
    message=models.CharField(max_length=300)
    