import re
import requests
import json
import os

# This logic is for getting data from CEYO FINA database and parsing it to be used on website 


SCOPE = "http://178.134.42.98:8080/"


# change this before prod!!!
def auth():
    url = SCOPE + "api/authentication/authenticate"
    try:
        payload = {
            "login": os.environ.get("LOGIN"),
            "password": os.environ.get("PASSWORD")
}
        response = requests.post(url, json=payload)
        response.raise_for_status()
        data = response.json()
        print("Auth response:", data)
        token = data.get('token')
        ex = data.get('ex')
        if ex:
            raise PermissionError(f"Auth error info: {ex}")
        if not token:
            raise PermissionError("No token found in authentication response.")
            
        print(f"Received token: {token}")
        return token
    except requests.RequestException as e:
        raise PermissionError(f"Error authenticating: {e}")
        

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
    'BLUE','NAVY','RED','GREEN','GREY','GRAY','MINT','MİNT','PINK','PURPLE','ORANGE',
    'SAX','PLATIN','FUME','GUMUS','MUSTARD','BROWN','BEIGE','GOLD','MINK','COFFEE','TOBACCO',
    'BURGUNDY','PEARL RED','LEOPARD','SILVERGREY','DARK RED','DK. BEIGE','L. BLUE','FUCHSIA',
    'PUCHSIA','SEDEF KIRMIZI','ANTRASITE','PLATINUM','COPPER','DARK BLUE','DK. BEIGE','ALTIN',
    'CAMEL','SILVER','PEMBE','SARI','VIZON','BORDO','BEJ','NAVY BLUE','DK. BEIGE','DK. BLUE',
    'PEARL','MINK','TOBACCO','COFFEE','BROWN','FUCHSIA','PUCHSIA','MUSTARD','PLATIN','GUMUS',
    'GRAY','GREY','WHITE','BLACK','BLUE','GREEN','RED','PINK','PURPLE','ORANGE','YELLOW',
    'SAX','LACIVERT','KIRMIZI','SIYAH','BEYAZ','GRI','YESIL','MOR','TURUNCU','HARDAL','KREM',
    'LILA','TABA','KHAKI','HAKI','HAKİ','GOLD','PLATINUM','COPPER','ANTRASITE','LEOPARD',
    'SILVERGREY','DARK RED','LIGHT COFFEE','DARK BLUE','DK. BLUE','DK. BEIGE','L. BLUE',
    'PEARL RED','SEDEF KIRMIZI','PUCHSIA','FUCHSIA','MUSTARD','BROWN','BEIGE','MINK','COFFEE',
    'TOBACCO','BURGUNDY','SILVER','CAMEL','ALTIN','PLATIN','GUMUS','VIZON','NAVY','NAVY BLUE',
    'SAX','PEMBE','PUDRA','MAVI','LACIVERT','KIRMIZI','SIYAH','BEYAZ','GRI','YESIL','MOR',
    'TURUNCU','HARDAL','KREM','LILA','TABA','KHAKI','HAKI','HAKİ','GOLD','PLATINUM','COPPER',
    'ANTRASITE','LEOPARD','SILVERGREY','DARK RED','LIGHT COFFEE','DARK BLUE','DK. BLUE',
    'DK. BEIGE','L. BLUE','PEARL RED','SEDEF KIRMIZI','PUCHSIA','FUCHSIA','MUSTARD','BROWN',
    'BEIGE','MINK','COFFEE','TOBACCO','BURGUNDY','SILVER','CAMEL','ALTIN'
}
COLOR_MODIFIERS = {'ACIK','AÇIK','KOYU','LIGHT','DARK'}

def parse_product_name(product_name: str, id: int):
    # 1) Remove ranges or notes in parentheses anywhere, e.g., (35-39)
    s = re.sub(r'\([^)]*\)', '', product_name or '').strip()
    # Normalize dots/spaces/hyphens -> tokens
    s = re.sub(r'[-]', ' ', s)
    parts = [p.strip() for p in re.split(r'[.\s]+', s) if p.strip()]
    if not parts:
        return id, None, None, None

    # 2) Detect size at the end: either NN or NN-NN or NN-NN-NN
    size = None
    size_idx = len(parts)
    last = parts[-1]
    if re.fullmatch(r'\d{1,3}', last):
        size = last
        size_idx = len(parts) - 1
    elif re.fullmatch(r'\d{1,3}-\d{1,3}', last):
        size = last
        size_idx = len(parts) - 1
    elif re.fullmatch(r'\d{1,3}-\d{1,3}-\d{1,3}', last):
        size = last
        size_idx = len(parts) - 1

    # 3) Detect color: scan for known color tokens, including multi-word colors
    color = None
    color_idx = -1
    # Try to find color token anywhere before size
    for i in range(size_idx):
        token = parts[i].upper().replace(",", "").replace(".", "")
        next_token = parts[i+1].upper() if i+1 < size_idx else ""
        prev_token = parts[i-1].upper() if i-1 >= 0 else ""
        # Check for two-word color (modifier + color)
        if token in COLOR_MODIFIERS and next_token in COLOR_TOKENS:
            color = parts[i] + ' ' + parts[i+1]
            color_idx = i
            break
        # Check for color token
        if token in COLOR_TOKENS:
            color = parts[i]
            color_idx = i
            break
        # Check for color token with modifier after (e.g., BLUE DARK)
        if next_token in COLOR_MODIFIERS and token in COLOR_TOKENS:
            color = parts[i] + ' ' + parts[i+1]
            color_idx = i
            break
    # Fallback: if not found, try last token before size if alphabetic
    if color is None and size_idx > 0:
        candidate = parts[size_idx-1]
        if candidate.isalpha():
            color = candidate
            color_idx = size_idx-1

    # 4) Name is everything before color_idx (if found); otherwise all tokens before size
    if color is not None and color_idx > 0:
        name_only = ' '.join(parts[:color_idx])
    else:
        name_only = ' '.join(parts[:size_idx]) if size is not None else ' '.join(parts)

    return id, name_only.strip().replace(' ','-') or None, color, size


def check_parsing(products):
    # products: list of dicts with 'name' key
    original_names = [p['name'] for p in products]
    original_colors = set()
    parsed_items = []
    parsed_colors = set()
    for product in products:
        id, name_only, color, size = parse_product_name(product['name'], product['id'])
        parsed_items.append((id, name_only, color, size))
        # Only count single-token colors (no spaces)
        if color:
            color_tokens = color.upper().split()
            if len(color_tokens) == 1:
                parsed_colors.add(color_tokens[0])
        # For original, scan tokens in name and count only single-token colors
        for part in re.split(r'[.\s]+', product['name']):
            t = part.upper().replace(",", "").replace(".", "")
            if t in COLOR_TOKENS:
                original_colors.add(t)

    print(f"Original item count: {len(original_names)}")
    print(f"Parsed item count: {len(parsed_items)}")
    print(f"Original color count: {len(original_colors)}")
    print(f"Parsed color count: {len(parsed_colors)}")

    missing_colors = original_colors - set(COLOR_TOKENS)
    print("Colors in data not in COLOR_TOKENS:", missing_colors)
    return {
        "original_item_count": len(original_names),
        "parsed_item_count": len(parsed_items),
        "original_color_count": len(original_colors),
        "parsed_color_count": len(parsed_colors),
        "missing_colors": missing_colors
    }


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
        if product1.get("price"):
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

    # remove before prod
    old_colors = set()
    old_sizes = set()

    for _, product in enumerate(products_shoes):
        if product['name']:
            id, n, c, s = parse_product_name(product['name'], product['id'])
            product_ids.append(id)
            product_attrs[id] = {"name":n, "color":c, "size":s}

            old_colors.add(c)
            old_sizes.add(s)


    
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

    # check if data is lost during parsing

    check_parsing(products_shoes)

    final_products = join_products(products_price_rest, product_attrs, product_barcodes,products_parent)


    # returning final joined products
    return final_products


if __name__ == "__main__":
    main()

