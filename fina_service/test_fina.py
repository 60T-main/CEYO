from get_data import fetch, auth, parse_product_name,price_rest_info,join_products
import json


token = auth()
data = fetch("api/operation/getProducts", token)

products = json.loads(data).get("products")
products_shoes = []

for product in products:
    if product['group_id'] == 11:
        products_shoes.append(product)

product_ids=[]

product_shoes_parsed = []

product_attrs={}

for _, product in enumerate(products_shoes):
    if product['name']:
        id, n, c, s = parse_product_name(product['name'], product['id'])
        product_ids.append(id)
        product_shoes_parsed.append([id, n, c, s])
        product_attrs[id] = {"name":n, "color":c, "size":s}

products_price_rest = price_rest_info(token, product_ids)


product_barcodes = []
product_barcodes_dict = {}
barcodes = fetch("api/operation/getProductsBarcodeArray", token, body=product_ids, method="POST")
barcodes = json.loads(barcodes)
for _, value in barcodes.items():
    if value:
        for barcode in value:
            if barcode and barcode["barcode"] and barcode["product_id"]:
                product_barcodes.append(barcode["barcode"])
                product_barcodes_dict[barcode["product_id"]] = barcode["barcode"]


def get_products():
    new_data = {}
    with open('products.json','r') as f:
        data = json.load(f)
        for product in data:
            new_data[product.get('name')] = product.get('id')
    return new_data

final_products = join_products(products_price_rest, product_attrs,product_barcodes_dict,get_products())


print("before:",len(products_shoes))
print("after parsing:",len(product_shoes_parsed))
print("product ids:",len(product_ids))
print("products_prices:",len(products_price_rest))
print("product_barcodes:",len(product_barcodes))
print("final_products:",len(final_products))

