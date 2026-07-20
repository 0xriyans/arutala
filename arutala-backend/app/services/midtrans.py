import midtransclient
from app.core.config import settings

# Initialize Midtrans Snap client
snap = midtransclient.Snap(
    is_production=settings.MIDTRANS_IS_PRODUCTION,
    server_key=settings.MIDTRANS_SERVER_KEY,
    client_key=settings.MIDTRANS_CLIENT_KEY
)

# Override notification URL
snap.api_config.custom_headers = {
    'x-override-notification': f"{settings.BASE_URL}/api/payments/midtrans/webhook"
}

def create_snap_transaction(order_id: str, gross_amount: int, customer_details: dict, item_details: list):
    """
    Create a Midtrans Snap transaction and return the token and redirect_url.
    """
    param = {
        "transaction_details": {
            "order_id": order_id,
            "gross_amount": gross_amount
        },
        "customer_details": customer_details,
        "item_details": item_details
    }
    
    try:
        transaction = snap.create_transaction(param)
        return {
            "token": transaction['token'],
            "redirect_url": transaction['redirect_url']
        }
    except Exception as e:
        return {"error": str(e)}
