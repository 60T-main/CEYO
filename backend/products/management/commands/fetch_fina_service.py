from django.core.management.base import BaseCommand
from products.fina_services import call_fina_service_api
from products.models import Product, ProductVariant
from products.management.commands.attribute_values import attribute_value_dict

class Command(BaseCommand):
    help = 'Fetch data from fina_service API'

    def handle(self, *args, **kwargs):
        data = call_fina_service_api(endpoint="products", method="GET")
        products = Product.objects.prefetch_related("variants", "variants__attributes",
            "variants__attributes__attribute")
        variants = ProductVariant.objects.select_related("product")

        product_variants = []

        # if product variants don't exist, populate db with products from FINA  
        if not variants.exists():
            not_exist = []
            for id,value in data.items():
                if not attribute_value_dict.get(value['size']):
                    not_exist.append([[value['name'],value['size']]])
                elif not attribute_value_dict.get(value['color'].upper()):
                    not_exist.append([[value['name']],value['color'].upper()])
                else:
                    variant = ProductVariant(id=id,product=products.get(pk=value['product_id']), sku=value['barcode'], price=value['price'],stock_main=value['rest'], stock_shop=value['rest_store'])
                    product_variants.append(variant)
                    
            if product_variants:
                ProductVariant.objects.bulk_create(product_variants)

                # edge cases with color inconsistency from fina db
                COLOR_MAP = {
                    "FUSYA": "FUSIA",
                    "SARI": "YELLOW",
                    "BEIJE": "BEIGE",
                    "LELAC": "PURPLE",
                    "KAHVE": "BROWN",
                }

                for id, value in data.items():
                    color_key = value['color'].upper()
                    color = COLOR_MAP.get(color_key, value['color'])
                    try:
                        variant = ProductVariant.objects.get(id=id)
                    except ProductVariant.DoesNotExist:
                        print('Variant Not Found.. id:', id)

                    variant.attributes.set              ([attribute_value_dict.get(value            ['size']), attribute_value_dict.get             (color)])


        # if product variants exist, check for changes in rest
        else:
            changed = {}
            for variant in variants:
                if str(variant.id) in data.keys():
                    fina_rest_main = data[str(variant.id)]['rest']
                    local_rest_main = variant.stock_main
                    fina_rest_shop = data[str(variant.id)]['rest_store']
                    local_rest_shop = variant.stock_shop
                    
                    if not fina_rest_main == local_rest_main:
                        variant.stock_main = fina_rest_main
                        variant.save()
                        changed[variant.id] = {"rest_main": variant.stock_main}
                        
                    if not fina_rest_shop == local_rest_shop:
                        variant.stock_shop = fina_rest_shop
                        variant.save()
                        changed[variant.id] = {"rest_shop": variant.stock_shop}
            if changed.items():
                print(changed)
            else:
                print('no changes made')
                    


                    
            

            

        