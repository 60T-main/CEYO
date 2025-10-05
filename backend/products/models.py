from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator


class Category(models.Model):
    MEN = 'Men'
    WOMEN = 'Women'
    KIDS = 'Kids'

    CATEGORY_CHOICES = [
        ('კაცი', 'კაცი'),
        ('ქალი', 'ქალი'),
        ('ბავშვი', 'ბავშვი'),
    ]

    category_id = models.AutoField(primary_key=True)
    name = models.CharField(
        max_length=10,
        choices=CATEGORY_CHOICES,
        unique=True
    )

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name



class Product(models.Model):
    sku = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=200)
    color = models.TextField(max_length=50)
    size = models.TextField(max_length=50)
    description = models.TextField(blank=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_qty = models.IntegerField(default=0)
    last_modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.sku} - {self.name} - {self.color} - {self.size}"
    

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name="images", on_delete=models.CASCADE)
    image = models.URLField(max_length=500)
    alt_text = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Image for {self.product.name}"
    


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
        Product, 
        on_delete=models.CASCADE
    )
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('cart', 'product')

    def __str__(self):
        return f"{self.quantity} × {self.product.name}"

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
        return f'log for {self.product.name} : {self.message[:30]}'




