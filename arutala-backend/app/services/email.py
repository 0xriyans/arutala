import smtplib
import os
from string import Template
from email.message import EmailMessage
from email.utils import formataddr
from app.core.config import settings

def send_email_background(to_email: str, to_name: str, subject: str, html_content: str):
    """
    Sends an email using SMTP. This function is designed to be run in a BackgroundTask.
    """
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        print(f"SMTP not configured. Mocking email to {to_email}: {subject}")
        return

    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = formataddr(("ARUTALA", settings.SMTP_USER))
    msg['To'] = formataddr((to_name, to_email))
    
    msg.set_content("Please enable HTML to view this email.")
    msg.add_alternative(html_content, subtype='html')

    try:
        with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)
            print(f"Email sent successfully to {to_email}")
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")

def _load_template(filename: str) -> Template:
    template_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "templates", filename)
    try:
        with open(template_path, 'r', encoding='utf-8') as f:
            return Template(f.read())
    except Exception as e:
        print(f"Error loading template {filename}: {e}")
        return Template("<html><body>$customer_name, your order $order_ref was updated.</body></html>")

def get_order_confirmation_html(order_ref: str, customer_name: str, total: int, payment_link: str) -> str:
    template = _load_template("order_confirmation.html")
    formatted_total = f"Rp {total:,}"
    return template.safe_substitute(
        customer_name=customer_name,
        order_ref=order_ref,
        total=formatted_total,
        payment_link=payment_link
    )

def get_payment_success_html(order_ref: str, customer_name: str) -> str:
    template = _load_template("payment_success.html")
    return template.safe_substitute(
        customer_name=customer_name,
        order_ref=order_ref
    )

def get_payment_failed_html(order_ref: str, customer_name: str) -> str:
    template = _load_template("payment_failed.html")
    return template.safe_substitute(
        customer_name=customer_name,
        order_ref=order_ref
    )

def get_shipping_notification_html(order_ref: str, customer_name: str, tracking_number: str, courier: str) -> str:
    template = _load_template("shipping_notification.html")
    return template.safe_substitute(
        customer_name=customer_name,
        order_ref=order_ref,
        tracking_number=tracking_number,
        courier=courier.upper() if courier else "Courier"
    )
