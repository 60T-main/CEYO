from django.urls import path
from .views import ProductListView
urlpatterns = [
    path('', ProductListView.as_view(), name='product-list'),           
    # path('add/', ProductCreateView.as_view(), name='product-add'),     
    # path('<int:pk>/', ProductDetailView.as_view(), name='product-detail'), # GET one / update
    # path('<int:pk>/delete/', ProductDeleteView.as_view(), name='product-delete'), # DELETE
]
