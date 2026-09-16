import smtplib
import os

SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp-relay.brevo.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))

SMTP_LOGIN = os.getenv("SMTP_LOGIN")
SMTP_KEY = os.getenv("SMTP_KEY")

SENDER_EMAIL = os.getenv("SENDER_EMAIL")


def send_email(email_subject, email_message, receiver_email):

    server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
    server.starttls()
    server.login(SMTP_LOGIN, SMTP_KEY)

    message = (
        f"From: {SENDER_EMAIL}\r\n"
        f"To: {receiver_email}\r\n"
        f"Subject: {email_subject}\r\n"
        f"MIME-Version: 1.0\r\n"
        f"Content-Type: text/plain; charset=utf-8\r\n"
        f"\r\n"
        f"{email_message}"
    ).encode("utf-8")

    server.sendmail(SENDER_EMAIL, receiver_email, message)
    server.quit()