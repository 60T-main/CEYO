import time
from django.dispatch import receiver
from .models import Product, ProductLog
from django.db.models.signals import post_save

@receiver(post_save, sender = Product)
def log_product_creation(sender,instance,created,**kwargs):
    if created:
        ProductLog.objects.create(
            product = instance,
            message = f'Product {instance.name} was created on {time.time():.3f}'
        )
    else:
        ProductLog.objects.create(
            product=instance,
            message=f'Product {instance.name} was updated on {time.time():.3f}'
        )

