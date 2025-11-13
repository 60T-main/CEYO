from flask import Flask, jsonify
from get_data import main

app = Flask(__name__)

@app.route('/products', methods=['GET'])
def get_products():
    result = main()
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)