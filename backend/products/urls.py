from django.urls import path
from .views import ProductListView, ProductDetailView, CategoryView
urlpatterns = [
    path('', ProductListView.as_view(), name='product-list'),            
    path('<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('categories/', CategoryView.as_view(), name='categories'),
]
