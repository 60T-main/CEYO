from rest_framework import serializers
from .models import Product, Category, Cart

class ProductSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ["id", 'sku', 'name', 'description', 'category', 'price', 'stock_qty', 'last_modified', 'images']

    def get_images(self, obj):
        request = self.context.get('request')
        if request:
            return [request.build_absolute_uri(img.image.url) for img in obj.images.all()]
        else:
            return [img.image.url for img in obj.images.all()]

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class CartSerializer(serializers.ModelSerializer):
    cart_items = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = '__all__'

    def get_cart_items(self, obj):
        return [
            {
                "id": item.product.id,
                "cart_item_id": item.id,
                "name": item.product.name,
                "quantity": item.quantity,
                "unit_price": float(item.product.price),
                "subtotal": float(item.subtotal),
            }
            for item in obj.items.all()
        ]
            

        

    