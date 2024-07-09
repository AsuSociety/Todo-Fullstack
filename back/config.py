from fastapi_mail import ConnectionConfig

# from dotenv import dotenv_values
from dotenv import load_dotenv

# credentiala = dotenv_values(".env")
import os 
load_dotenv()

conf = ConnectionConfig(
    # MAIL_USERNAME=credentiala['EMAIL'],
    # MAIL_PASSWORD=credentiala['PASS'],
    # MAIL_FROM=credentiala['EMAIL'],

    MAIL_USERNAME=os.getenv('EMAIL'),
    MAIL_PASSWORD=os.getenv('PASS'),
    MAIL_FROM=os.getenv('EMAIL'),
    MAIL_PORT=587,  # TLS port
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,  # Enable TLS
    MAIL_SSL_TLS=False,  # Disable SSL, use TLS instead
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

