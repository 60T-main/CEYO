import xml.etree.ElementTree as ET
import os

from update_xml import update


URL = os.environ.get("FINA_SERVICE_URL")

def parse_xml():
    update()
    parsed = {}
    tree = ET.parse("ceyo.com.tr.xml")
    root = tree.getroot()
    for products in root:
        for product in products:
            if product.tag == "subproducts":
                for subproduct in product:
                    barcode = ''
                    images = ''
                    for attr in subproduct:
                        if attr.tag == "barcode":
                            barcode = attr.text
                        if attr.tag == "images":
                            for image in attr:
                                images = image.text
                                break
                    if barcode:
                        parsed[barcode] = images
    return parsed



def main():
    parse_xml()

if __name__ == "__main__":
    main()