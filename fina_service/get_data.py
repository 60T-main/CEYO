import re
import requests
import json

SCOPE = "http://178.134.42.98:8080/"

def auth():
    url = SCOPE + "api/authentication/authenticate"
    try:
        payload = {
            "login": "ceyo-api",
            "password": "duduKI12051997!"
        }
        response = requests.post(url, json=payload)
        response.raise_for_status()
        data = response.json()
        print("Auth response:", data)
        token = data.get('token')
        ex = data.get('ex')
        if ex:
            print(f"Auth error info: {ex}")
        if not token:
            print("No token found in authentication response.")
            return None
        print(f"Received token: {token}")
        return token
    except requests.RequestException as e:
        print(f"Error authenticating: {e}")
        return None

def fetch(endpoint, token, body=None, method=None):
    url = SCOPE + endpoint
    try:
        headers = {}
        json = None 
        if token:
            headers['Authorization'] = f'Bearer {token}'
        if body is not None:
            json = body

        if method == "POST":
            response = requests.post(url, headers=headers, json=json)
        else:
            response = requests.get(url, headers=headers)

        response.raise_for_status()
        return response.text
    except requests.RequestException as e:
        print(f"Error fetching {url}: {e}")
        if e.response is not None:
            print("Server response:", e.response.text)
        return None





# Common color tokens (uppercase). Extend as needed for your catalog.
COLOR_TOKENS = {
    'KIRMIZI','LACIVERT','MAVI','SIYAH','BEYAZ','PUDRA','FUSYA','PEMBE','SARI','KAHVE',
    'KAHVERENGI','KAHVERENGİ','GRI','GRİ','YESIL','YEŞIL','MOR','TURUNCU','HARDAL','KREM',
    'LILA','LİLA','TABA','VIZON','VİZON','BORDO','BEJ','KHAKI','HAKI','HAKİ','BLACK','WHITE',
    'BLUE','NAVY','RED','GREEN','GREY','GRAY','MINT','MİNT','PINK','PURPLE','ORANGE'
}
COLOR_MODIFIERS = {'ACIK','AÇIK','KOYU','LIGHT','DARK'}

def parse_product_name(product_name: str, id: int):
    # 1) Remove ranges or notes in parentheses anywhere, e.g., (35-39)
    s = re.sub(r'\([^)]*\)', '', product_name or '').strip()
    # Normalize dots/spaces -> tokens
    parts = [p for p in re.split(r'[.\s]+', s) if p]
    if not parts:
        return None, None, None

    # 2) Detect size at the end: either NN or NN-NN
    size = None
    size_idx = len(parts)
    last = parts[-1]
    if re.fullmatch(r'\d{1,3}', last):
        size = last
        size_idx = len(parts) - 1
    elif re.fullmatch(r'\d{1,3}-\d{1,3}', last):
        size = last  # keep range as-is
        size_idx = len(parts) - 1

    # 3) Detect color: prefer known color token just before size
    color = None
    color_idx = -1
    probe_idx = (size_idx - 1) if size is not None else (len(parts) - 1)
    if probe_idx >= 0:
        candidate = parts[probe_idx]
        cu = candidate.upper()
        if cu in COLOR_TOKENS:
            color = candidate
            color_idx = probe_idx
            # Optional two-word color with modifier before (e.g., ACIK MAVI)
            prev_idx = probe_idx - 1
            if prev_idx >= 0 and parts[prev_idx].upper() in COLOR_MODIFIERS:
                color = parts[prev_idx] + ' ' + color
                color_idx = prev_idx
        else:
            # Fallback: if it's purely alphabetic and preceding token looks like a model (has digits/hyphen),
            # treat this as color. Avoid absorbing model tokens like 'ASSOS-Z'.
            if candidate.isalpha():
                color = candidate
                color_idx = probe_idx

    # 4) Name is everything before color_idx (if found); otherwise all tokens before size
    if color is not None and color_idx > 0:
        name_only = ' '.join(parts[:color_idx])
    else:
        name_only = ' '.join(parts[:probe_idx]) if size is not None else ' '.join(parts)

    return id, name_only.strip() or None, color, size


def price_rest_info(token, product_ids: list):
    data_warehouse = fetch("api/operation/getProductsRestAdvance", token,
        {
            "prods": product_ids,
            "store": 1,
            "price": 3
        }, "POST"
    )
    data_store = fetch("api/operation/getProductsRestAdvance", token,
        {
            "prods": product_ids,
            "store": 2,
            "price": 3
        }, "POST"
    )

    warehouse = json.loads(data_warehouse).get("rest_info", [])
    store = json.loads(data_store).get("rest_info", [])

    # Build lookup dict for store by product id
    store_dict = {p["id"]: p for p in store if p and "id" in p}

    products_with_rest = {}
    for product1 in warehouse:
        pid = product1.get("id")
        if not pid:
            continue
        if product1.get("rest") and product1.get("price"):
            rest_store = store_dict.get(pid, {}).get("rest")
            products_with_rest[pid] = {
                "price": product1.get("price"),
                "rest": product1.get("rest"),
                "rest_store": rest_store
            }

    return products_with_rest


def get_products():
    new_data = {}
    with open('products.json','r') as f:
        data = json.load(f)
        for product in data:
            new_data[product.get('name')] = product.get('id')
    return new_data
            


    

def join_products(products_price_rest: list, product_attrs: dict , product_barcodes: dict, products: dict):
    merged = {}
    for id_rest,value in products_price_rest.items():
        if id_rest in product_attrs.keys() and id_rest in product_barcodes.keys() and product_attrs[id_rest]["name"] in products.keys():
            merged[id_rest] = {"name":product_attrs[id_rest]["name"], "product_id": products[product_attrs[id_rest]["name"]], "color":product_attrs[id_rest]["color"], "size":product_attrs[id_rest]["size"], "rest": value["rest"],"rest_store": value["rest_store"], "price": value["price"], "barcode": product_barcodes[id_rest]}
    return merged



def get_images(joined_products: dict):
    images_dict = {}
    paired_images = {}
    with open("paired-imgs.json", "r") as f:
        data = json.load(f)
        for product in data:
            images_dict[product["name"].split(' ')[0].strip()] = {"color":product["color"], "images":product["images"]}
    for id,value in joined_products.items():
        if value["name"] in images_dict.keys() and value["color"] == images_dict[value["name"]]["color"] and images_dict[value["name"]]["images"]:
            paired_images[id] = {"name":value["name"],"color":value["color"], "size":value["size"], "rest":value["rest"],"rest_store": value["rest_store"] ,"barcode": value["barcode"], "images": images_dict[value["name"]]["images"]}

    return paired_images




def main():
    # getting token for api auth
    token = auth()
    data = fetch("api/operation/getProducts", token)

    # getting products from fina database
    products = json.loads(data).get("products")
    products_shoes = []
    # getting only products from "საქონელი" category
    for product in products:
        if product['group_id'] == 11:
            products_shoes.append(product)

    # getting parent product ids from website database
    products_parent = get_products()

    # product variant ids, names, colors, sizes
    product_ids = []
    product_attrs= {}
    for _, product in enumerate(products_shoes):
        id, n, c, s = parse_product_name(product['name'], product['id'])
        product_ids.append(id)
        product_attrs[id] = {"name":n, "color":c, "size":s}
    
    # product variant prices and rest information
    products_price_rest = price_rest_info(token, product_ids)

    # getting product variant barcodes
    product_barcodes = {}
    barcodes = fetch("api/operation/getProductsBarcodeArray", token, body=product_ids, method="POST")
    barcodes = json.loads(barcodes)
    for _, value in barcodes.items():
        if value:
            for barcode in value:
                if barcode and barcode["barcode"] and barcode["product_id"]:
                    product_barcodes[barcode["product_id"]] = barcode["barcode"]

    # returning final joined products
    return join_products(products_price_rest, product_attrs, product_barcodes,products_parent)


if __name__ == "__main__":
    main()

