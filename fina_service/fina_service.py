from flask import Flask, jsonify, request
from get_data import main
from build_import_images import parse_xml
from product_out import save_product_out

app = Flask(__name__)

@app.route('/products', methods=['GET'])
def get_products():
    result = main()
    return jsonify(result)

@app.route('/sales', methods=['POST'])
def product_out():
    body = request.get_json()  
    result = save_product_out(body)
    return jsonify(result)

@app.route('/images', methods=['GET'])
def get_images():
    result = parse_xml()
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)