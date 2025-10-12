from rest_framework import serializers
from .models import Order, OrderItem


class OrderSerializer(serializers.ModelSerializer):
    order_items = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = '__all__'

    def get_order_items(self, obj):
        return [
            {
                "id": item.product.id,
                "cart_item_id": item.id,
                "name": item.product.name,
                "color": item.product.color,
                "size": item.product.size,
                "quantity": item.quantity,
                "unit_price": float(item.product.price),
            }
            for item in obj.items.all()
        ]