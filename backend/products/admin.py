from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from .models import ProductVariant
from .resources import ProductVariantResource
from django.apps import apps

@admin.register(ProductVariant)
class ProductVariantAdmin(ImportExportModelAdmin):
    resource_class = ProductVariantResource
    list_display = ("id", "product", "sku", "price", "stock_main", "stock_shop")

    def get_queryset(self, request):
        qs = super().get_queryset(request)

        return qs.select_related("product").prefetch_related("attributes")



app_models = apps.get_app_config("products").get_models()

for model in app_models:
    try:
        if model.__name__ == "ProductVariant":
            continue  # skip, already registered with custom admin
        class GenericAdmin(ImportExportModelAdmin):
            pass
        admin.site.register(model, GenericAdmin)
    except admin.sites.AlreadyRegistered:
        pass
