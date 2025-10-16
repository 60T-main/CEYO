from import_export import resources
from .models import ProductVariant

class ProductVariantResource(resources.ModelResource):
    class Meta:
        model = ProductVariant
        skip_unchanged = True
        report_skipped = True
        batch_size = 1000  

    def get_queryset(self):
        return super().get_queryset().select_related("product").prefetch_related("attributes")
