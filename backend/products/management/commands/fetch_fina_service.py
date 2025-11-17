from django.core.management.base import BaseCommand
from products.fina_services import call_fina_service_api
from products.models import Product, ProductVariant
from products.management.commands.attribute_values import attribute_value_dict

class Command(BaseCommand):
    help = 'Fetch data from fina_service API'

    def handle(self, *args, **kwargs):
        data = call_fina_service_api()
        products = Product.objects.prefetch_related("variants", "variants__attributes",
            "variants__attributes__attribute")
        variants = ProductVariant.objects.select_related("product")

        product_variants = []

        if not variants.exists():
            not_exist = []
            for id,value in data.items():
                if not attribute_value_dict.get(value['size']):
                    not_exist.append([[value['name'],value['size']]])
                elif not attribute_value_dict.get(value['color'].upper()):
                    not_exist.append([[value['name']],value['color'].upper()])
                else:
                    variant = ProductVariant(id=id,    product=products.get(pk=value['product_id']), sku=value['barcode'], price=value['price'],stock_main=value['rest'], stock_shop=value['rest_store'])
                    product_variants.append(variant)
                    
            if product_variants:
                ProductVariant.objects.bulk_create(product_variants)
        for id, value in data.items():
            color = ''   
            if value['color'].upper() == "FUSYA":
                color = "FUSIA"
            elif value['color'].upper() == "SARI":
                color = "YELLOW"
            elif value['color'].upper() == "BEIJE":
                color = "BEIGE"
            elif value['color'].upper() == "LELAC":
                color = "PURPLE"
            elif value['color'].upper() == "KAHVE":
                color = "BROWN"
            else:
                color = value['color']
            try:
                variant = ProductVariant.objects.get(id=id)
            except ProductVariant.DoesNotExist:
                print('Variant Not Found.. id:', id)
            variant.attributes.set([attribute_value_dict.get(value['size']), attribute_value_dict.get(color)])

            # print(len(not_exist)," - products not found")
        else:
            ...
            

            

        