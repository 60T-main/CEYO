from django.test import TestCase
from unittest.mock import patch
from products.management.commands.fetch_fina_service import Command

from unittest import TestCase
from unittest.mock import patch
from products.fina_services import call_fina_service_api

class FetchFinaServicesTest(TestCase):
    @patch('products.fina_services.requests.get')
    def test_fetch_fina_success(self, mock_get):
        mock_response = {
            "4219": {
                "barcode": "8692519044112",
                "color": "RED",
                "name": "3000-2",
                "price": 75,
                "product_id": "9",
                "rest": 2,
                "rest_store": 1,
                "size": "37"
            }
        }
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = mock_response

        response = call_fina_service_api(endpoint="products", method="GET")
        self.assertIn("4219", response)
        self.assertEqual(response["4219"]["barcode"], "8692519044112")
        self.assertEqual(response["4219"]["color"], "RED")
        self.assertEqual(response["4219"]["size"], "37")
        self.assertEqual(response["4219"]["rest"], 2)
        self.assertEqual(response["4219"]["rest_store"], 1)

class PostFinaServicesTest(TestCase):
    @patch('products.fina_services.requests.post')
    def test_post_fina_success(self, mock_post):
        mock_post.return_value.status_code = 200
        mock_post.return_value.json.return_value = {"success": True}

        body = {
            "id": 0,
            "date": "2025-11-20T12:00:00",
            "purpose": "საცალო ონლაინ გაყიდვა",
            "amount": 100,
            "currency": "GEL",
            "store": 1,
            "user": 1,
            "customer": 0,
            "is_vat": True,
            "make_entry": True,
            "pay_type": 1,
            "price_type": 3,
            "products": [
                {"id": 4219, "quantity": 1, "price": 75}
            ]
        }

        response = call_fina_service_api(endpoint="sales", method="POST", body=body)
        self.assertEqual(response, {"success": True})
        mock_post.assert_called_once()
        args, kwargs = mock_post.call_args
        self.assertIn("sales", args[0])  
        self.assertEqual(kwargs["json"], body)  