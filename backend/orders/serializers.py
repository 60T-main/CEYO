from rest_framework import serializers
from .models import Order, OrderItem


class OrderSerializer(serializers.ModelSerializer):
    order_items = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = '__all__'

    def get_order_items(self, obj):
        result = []
        for item in obj.items.all():
            attributes = {}
            for attribute in item.product.attributes.all():
                attributes[attribute.attribute.name] = attribute.value
            result.append({
                "id": item.product.id,
                "cart_item_id": item.id,
                "name": item.product.product.name,
                "attributes": attributes,
                "quantity": item.quantity,
                "unit_price": float(item.product.price),
                "subtotal": float(item.subtotal),
            })
        return result
