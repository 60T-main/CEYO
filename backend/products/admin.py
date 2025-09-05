from django.contrib import admin
from .models import Product, Category, ProductImage
from import_export.admin import ImportExportModelAdmin


@admin.register(Product)
class ProductAdmin(ImportExportModelAdmin):
    pass

admin.site.register([Category, ProductImage])

