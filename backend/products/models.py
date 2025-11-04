from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    name_tr = models.CharField(unique=True,blank=True, null=True)
    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        related_name="children",
        blank=True,
        null=True
    )

    class Meta:
        verbose_name_plural = "categories"

    def __str__(self):

        names = [self.name]
        parent = self.parent
        visited = {self.pk}
        depth = 0
        MAX_DEPTH = 20
        while parent and depth < MAX_DEPTH:
            if parent.pk in visited:
                names.append("…")
                break
            names.append(parent.name)
            visited.add(parent.pk)
            parent = parent.parent
            depth += 1
        return " > ".join(reversed(names))




class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.ManyToManyField(Category, related_name='products')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    

class Attribute(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name
    
class AttributeValue(models.Model):
    attribute = models.ForeignKey(Attribute, on_delete=models.CASCADE, related_name="values")
    value = models.CharField(max_length=50)
    value_tr = models.CharField(blank=True, null=True)

    def __str__(self):
        """Avoid DB hits: use cached attribute if available, else fallback."""
        attr_name = None
        if 'attribute' in self.__dict__ and getattr(self, 'attribute', None):
            try:
                attr_name = self.attribute.name
            except Exception:
                attr_name = None
        if not attr_name:
            # Fallback without hitting DB
            if getattr(self, 'attribute_id', None):
                attr_name = f"Attribute #{self.attribute_id}"
            else:
                attr_name = "Attribute"
        try:
            val = self.value or ""
        except Exception:
            val = ""
        return f"{attr_name}: {val}"
    

class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="variants")
    sku = models.CharField(max_length=100, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_main = models.PositiveIntegerField(default=0)
    stock_shop = models.PositiveIntegerField(default=0)
    attributes = models.ManyToManyField(AttributeValue, related_name="variants")

    class Meta:
        unique_together = ("product", "sku")

    def __str__(self):
        """
        Safe string representation that avoids triggering extra DB queries.
        - Uses cached/prefetched relations only (product, attributes)
        - Falls back to lightweight labels if relations aren't loaded
        """
        # Base label uses SKU or PK without hitting DB
        base_label = f"Variant {self.sku or self.pk or 'unsaved'}"

        # Try to use cached product name if relation already loaded (no DB call)
        product_name = None
        if 'product' in self.__dict__ and getattr(self, 'product', None):
            try:
                product_name = self.product.name
            except Exception:
                product_name = None

        # Try to use prefetched attributes only (do NOT query if not prefetched)
        attrs_suffix = ""
        cache = getattr(self, "_prefetched_objects_cache", None)
        if cache and 'attributes' in cache:
            try:
                values = [av.value for av in cache['attributes'][:3]]
                if values:
                    attrs_suffix = f" ({', '.join(values)})"
            except Exception:
                attrs_suffix = ""

        label = product_name or base_label
        return f"{label}{attrs_suffix}"

class ProductImage(models.Model):
    product_variant = models.ForeignKey(ProductVariant, related_name="images", on_delete=models.CASCADE)
    image = models.URLField(max_length=500)
    alt_text = models.CharField(max_length=255, blank=True)

    def __str__(self):
        """Avoid DB hits: only use cached relations for label."""
        # Default lightweight label (no DB)
        base = f"Image #{self.pk or ''}".strip()
        name = None
        # Use cached product_variant if already loaded (no implicit fetch)
        if 'product_variant' in self.__dict__ and getattr(self, 'product_variant', None):
            pv = self.product_variant
            # Use cached parent product if already loaded
            if hasattr(pv, '__dict__') and 'product' in pv.__dict__ and getattr(pv, 'product', None):
                try:
                    name = pv.product.name
                except Exception:
                    name = None
        return f"Image for {name}" if name else base
    


class Cart(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='carts',
        null=True, blank=True
    )
    session_key = models.CharField(
        max_length=40, blank=True, null=True,
        help_text="For anonymous carts before login"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Cart #{self.id} for {self.user or 'Guest'}"

    @property
    def total_items(self):
        return sum(item.quantity for item in self.items.all())

    @property
    def total_price(self):
        return sum(item.subtotal for item in self.items.all())


class CartItem(models.Model):
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name='items'
    )
    product = models.ForeignKey(
        ProductVariant, 
        on_delete=models.CASCADE,
        related_name='cart_items'
    )
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('cart', 'product')

    def __str__(self):
        """Avoid DB hits in admin by only using cached relations."""
        product_label = None
        # Access cached product variant if available
        if 'product' in self.__dict__ and getattr(self, 'product', None):
            pv = self.product
            # Access cached parent product if available
            if hasattr(pv, '__dict__') and 'product' in pv.__dict__ and getattr(pv, 'product', None):
                try:
                    product_label = pv.product.name
                except Exception:
                    product_label = None
        product_label = product_label or f"Variant {getattr(self, 'product_id', '')}"
        return f"{self.quantity} × {product_label}"

    @property
    def subtotal(self):
        return self.product.price * self.quantity
    

class Comment(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='comments')

    name = models.CharField(max_length=200)
    lastname = models.CharField(max_length=200)
    rating = models.PositiveSmallIntegerField(
            validators=[
            MinValueValidator(1),
            MaxValueValidator(5)
        ]
    )
    comment = models.CharField(max_length=1000)

    created_at = models.DateTimeField(auto_now_add=True)




class ProductLog(models.Model):
    product = models.ForeignKey(
        Product, 
        on_delete=models.CASCADE
    )
    message = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        try:
            product_name = self.product.name if getattr(self, "product_id", None) else "Unknown product"
        except Exception:
            product_name = "Unknown product"
        try:
            preview = (self.message or "")[:30]
        except Exception:
            preview = ""
        return f'log for {product_name} : {preview}'




