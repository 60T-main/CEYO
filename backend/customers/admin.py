from django.contrib import admin
from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from django.apps import apps


# Get all models from your app
app_models = apps.get_app_config('customers').get_models()

for model in app_models:
    try:
        class GenericAdmin(ImportExportModelAdmin):
            pass
        admin.site.register(model, GenericAdmin)
    except admin.sites.AlreadyRegistered:
        pass
