from rest_framework import serializers
from .models import Product, Category, Cart, Comment

class ProductSerializer(serializers.ModelSerializer):
    product_variants = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def _prefetched_list(self, instance, rel_name: str):
        cache = getattr(instance, "_prefetched_objects_cache", None)
        if cache and rel_name in cache:
            return cache[rel_name]
        manager = getattr(instance, rel_name)
        return list(manager.all())

    def get_images(self, obj):
        images = []
        variants = self._prefetched_list(obj, 'variants')
        for variant in variants:
            variant_images = self._prefetched_list(variant, 'images')
            images.extend([img.image for img in variant_images])
        return images

    def get_product_variants(self, obj):
        result = []
        variants = self._prefetched_list(obj, 'variants')
        for variant in variants:
            attrs = self._prefetched_list(variant, 'attributes')
            images = self._prefetched_list(variant, 'images')
            result.append({
                "id": obj.id,
                "variant_id": variant.id,
                "name": obj.name,
                "attributes": [
                    {"id": attr.id, "attribute_id": attr.attribute_id, "value": attr.value, "value_tr": attr.value_tr}
                    for attr in attrs
                ],
                "images": [
                    (img.image.url if hasattr(img.image, 'url') else str(img.image))
                    for img in images
                ],
                "price": variant.price,
                "stock_main": variant.stock_main,
                "stock_shop": variant.stock_shop,
            })
        return result
    


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class CartSerializer(serializers.ModelSerializer):
    cart_items = serializers.SerializerMethodField()
    total_price = serializers.ReadOnlyField()
    total_items = serializers.ReadOnlyField()
    

    class Meta:
        model = Cart
        fields = '__all__'

    def get_cart_items(self, obj):
        return [
            {
                "id": item.product.id,
                "cart_item_id": item.id,
                "name": item.product.name,
                "color": item.product.color,
                "size": item.product.size,
                "images": [img.image.url if hasattr(img.image, 'url') else str(img.image) for img in item.product.images.all()],
                "quantity": item.quantity,
                "unit_price": float(item.product.price),
                "subtotal": float(item.subtotal),
            }
            for item in obj.items.all()
        ]
    

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

            

        

    