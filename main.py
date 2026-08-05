# ეს ფუნქცია აკეთებს მონაცემთა ბაზის ფუნქციების იმპორტს
from database import create_table, insert_bill

# ეს კი პარლამენტის API დან მონაცემების ფუნქციის იმპორტს
from api_client import get_bills

#ცხრილის შექმნის ფუნქცია
create_table()

# API დან მონაცემების მიღება
bills = get_bills()

# ეს იქნება სია ლისტის სახით სადაც შევინახავ მხოლოდ ახალ კანონპროექტებს რომელიც ბაზაში არაა
new_bills = []


# ეს არის ახალი ცვლადი სადაც შევაგროვებთ email ზე გასაგზავნ ტექსტდს
email_message = ""

# მირებული კანონპროექტის ციკლით დამუშავება
for option in bills:
    # კანონპროექტის მონაცემთა ბაზაში დამატება და პარალელურად ცვლადში შენახვა
    was_saved = insert_bill(
                option["id"],
                option["billName"]
    )
# აქ პირობას ვადგენთ რომ თუ ახალია კანონპროექტი რომელიც არაა ბაზაში, მაშინ ვამატებთ
    if was_saved:
        new_bills.append(option)

# სათაურის შექმნა ელ ფოსტისთვის
email_message += f"ნაპოვნია {len(new_bills)} ახალი საკანონმდებლო ინიციატივა.\n\n"

# ელფოსტით გასაგზავნი ტექსტში დანომრილი კანონპროექტების ჩამონათვალის გაკეთება
for number, option in enumerate(new_bills, start=1):
    email_message += (f"{number}. {option['billName']}" + "\n")




