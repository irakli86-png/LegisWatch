import smtplib

SMTP_SERVER = "smtp-relay.brevo.com"
SMTP_PORT = 587


SMTP_LOGIN = "b48c03001@smtp-brevo.com"
SMTP_KEY = ""

SENDER_EMAIL = "legiswatch@outlook.com"



def send_email(email_subject, email_message, receiver_email):
    server = smtplib.SMTP(SMTP_SERVER,SMTP_PORT)
    server.starttls()
    server.login(SMTP_LOGIN, SMTP_KEY)
    
#ეს ყველაფერი ქართული ფონტის გამო გაკეთდა ვინაიდან მეილზე არ აგზავნიდა ქართულად    
    message = (
    f"From: {SENDER_EMAIL}\r\n"
    f"To: {receiver_email}\r\n"
    f"Subject: {email_subject}\r\n"
    f"MIME-Version: 1.0\r\n"
    f"Content-Type: text/plain; charset=utf-8\r\n"
    f"\r\n"
    f"{email_message}").encode("utf-8")  
    server.sendmail(SENDER_EMAIL,receiver_email,message)
    
    server.quit()

    