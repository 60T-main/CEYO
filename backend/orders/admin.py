from django.contrib import admin
from .models import Order, OrderItem
from import_export.admin import ImportExportModelAdmin


admin.site.register([Order, OrderItem ])