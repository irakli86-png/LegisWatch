from fastapi import FastAPI

# მონაცემთა ბაზის ფუნქციების იმპორტი
from database import create_table, insert_bill

# პარლამენტის API-დან მონაცემების ფუნქციის იმპორტი
from api_client import get_bills

# Email ფუნქციის იმპორტი
from email_sender import send_email


# --------------------------------------------------
# FastAPI application
# --------------------------------------------------

app = FastAPI(title="LegisWatch")
create_table()


# მთავარი გვერდი
@app.get("/")
def home():
    return {
        "message": "LegisWatch is running"
    }

@app.get("/run")
def run():

    run_legiswatch()

    return {
        "message": "LegisWatch run completed"
    }

# --------------------------------------------------
# LegisWatch-ის ავტომატიზაციის ფუნქცია
# --------------------------------------------------

def run_legiswatch():

    # ცხრილის შექმნა
    create_table()

    # API-დან მონაცემების მიღება
    bills = get_bills()

    # სია, სადაც შევინახავთ მხოლოდ ახალ კანონპროექტებს
    new_bills = []

    # Email-ზე გასაგზავნი ტექსტი
    email_message = ""

    # მიღებული კანონპროექტების ციკლით დამუშავება
    for option in bills:

        # მონაცემთა ბაზაში დამატება
        was_saved = insert_bill(
            option["id"],
            option["billName"]
        )

        # თუ ახალი კანონპროექტია
        if was_saved:
            new_bills.append(option)

    # Email-ის სათაური
    email_message += (
        f"ნაპოვნია {len(new_bills)} ახალი საკანონმდებლო ინიციატივა.\n\n"
    )

    # დანომრილი კანონპროექტების ჩამონათვალი
    for number, option in enumerate(new_bills, start=1):

        email_message += (
            f"{number}. {option['billName']}\n"
        )

        # კონკრეტული კანონპროექტის ბმული
        email_message += (
            f"https://info.parliament.ge/#law-drafting/"
            f"{option['id']}\n\n"
        )

    # Email-ის მონაცემები
    email_subject = (
        "მოგესალმებათ LegisWatch - ახალი საკანონმდებლო ინიციატივები"
    )

    receiver_email = "irakli.ivanidze86@gmail.com"

    # Email-ის გაგზავნა
    send_email(
        email_subject,
        email_message,
        receiver_email
    )


# --------------------------------------------------
# თუ ფაილს პირდაპირ Python-ით გავუშვებთ
# --------------------------------------------------

if __name__ == "__main__":
    run_legiswatch()