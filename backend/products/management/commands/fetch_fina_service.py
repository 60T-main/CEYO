from django.core.management.base import BaseCommand
from products.fina_services import call_fina_service_api
from products.models import Product, ProductVariant
from products.management.commands.attribute_values import attribute_value_dict
import csv
from tqdm import tqdm
from products.utils import fetch_and_save_images

class Command(BaseCommand):
    help = 'Fetch data from fina_service API'

    def handle(self, *args, **kwargs):
        # edge cases with color inconsistency from fina db
        COLOR_MAP = {
            "FUSYA": "FUSIA",
            "FUSCHIA": "FUSIA",
            "FUSHIA": "FUSIA",
            "SARI": "YELLOW",
            "BEIJE": "BEIGE",
            "LELAC": "PURPLE",
            "KAHVE": "BROWN",
            "TPBACCO": "TOBACCO",
            "TABACCO": "TOBACCO",
            'BKACK':'BLACK',
            'BAKIR':'COPPER',
            'TURKUAZ':'TURQUOISE',
            'PEMBE':'PINK',
            'DORE':'GOLD',
            'ALTIN':'GOLD',
            'HAKI':'KHAKI',
            'MAVY':'BLUE',
            'ANTRACITE':'ANTHRACITE',

            
        }
        data = call_fina_service_api(endpoint="products", method="GET")
        products = Product.objects.prefetch_related("variants", "variants__attributes",
            "variants__attributes__attribute")
        variants = ProductVariant.objects.select_related("product")

        product_variants = []

        # if product variants don't exist, populate db with products from FINA  
        # if not variants.exists():
        #     not_exist = set()
        #     for id,value in tqdm(data.items(), desc="Populating DB"):
        #         color_key = value['color'].upper()
        #         color = COLOR_MAP.get(color_key, color_key)
        #         if not attribute_value_dict.get(value['size']):
        #             not_exist.add(("size", value['size']))
        #         elif not attribute_value_dict.get(color):
        #             not_exist.add(("color", color_key))
        #         else:
        #             stock_shop = max(0, value['rest_store'])
        #             stock_main = max(0, value['rest'])
        #             if not stock_shop and not stock_main:
        #                 continue
        #             variant = ProductVariant(id=id,product=products.get(pk=value['product_id']), sku=value['barcode'], price=value['price'],stock_main=stock_main, stock_shop=stock_shop)
        #             product_variants.append(variant)
        #     with open("not_exist.csv", 'w',newline='', encoding='utf-8') as f:
        #         writer = csv.writer(f)
        #         writer.writerows([item] for item in not_exist)

            # bulk create new variants 
            # if product_variants:
                # ProductVariant.objects.bulk_create(product_variants)

                # set attributes and images
        variant_map = {str(v.id): v for v in ProductVariant.objects.filter(id__in=data.keys())}

        for id, value in tqdm(data.items(),desc="Setting Attributes"):
            color_key = value['color'].upper()
            color = COLOR_MAP.get(color_key, color_key)
            if not attribute_value_dict.get(value['size']):
                continue
            elif not attribute_value_dict.get(color):
                continue
            
            variant = variant_map.get(str(id))
            if not variant:
                continue

            # check for attributes that are not Null
            attrs = [
            attribute_value_dict.get(value['size']),
            attribute_value_dict.get(color)
            ]
            attrs = [a for a in attrs if a is not None]

            # check if import colors matches existing colors
            color_key = value['color'].upper()
            color = COLOR_MAP.get(color_key, value['color'])

            # set images

            if attrs:
                # set attributes
                variant.attributes.set(attrs)
            
            else:
                print(f"Missing attribute for variant id {id}: size={value['size']}, color={color}")

        # set images
        fetch_and_save_images()
                
                



        # if product variants exist, check for changes in rest
        # else:
        #     changed = {}
        #     for variant in tqdm(variants, desc="Making Changes to Rest"):
        #         if str(variant.id) in data.keys():
        #             fina_rest_main = max(0,data[str(variant.id)]['rest'])
        #             local_rest_main = max(0,variant.stock_main)
        #             fina_rest_shop = max(0,data[str(variant.id)]['rest_store'])
        #             local_rest_shop = max(0,variant.stock_shop)
                    
        #             if not fina_rest_main == local_rest_main:
        #                 variant.stock_main = fina_rest_main
        #                 variant.save()
        #                 changed[variant.id] = {"rest_main": variant.stock_main}
                        
        #             if not fina_rest_shop == local_rest_shop:
        #                 variant.stock_shop = fina_rest_shop
        #                 variant.save()
        #                 changed[variant.id] = {"rest_shop": variant.stock_shop}
        #     if changed.items():
        #         print(changed)
        #     else:
        #         print('no changes made')
                    


                    
            

            

        