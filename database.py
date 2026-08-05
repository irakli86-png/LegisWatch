import sqlite3


# ეს ფუნქციია ქმნის bills ცხრილს
def create_table():

    # ამით ვაკავშირებ SQLite მონაცემთა ბაზასთან
    conn = sqlite3.connect("legiswatch.db")
    cursor = conn.cursor()

    # bills ცხრილს ვქმნით
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS bills(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            bill_id INTEGER UNIQUE,
            bill_name TEXT
        )
    """)

   
    conn.commit()
    conn.close()


# ამ ფუნქციით ვამოწმებთ, არსებობს თუ არა კონკრეტული bill_id ბაზაში
def bill_exists(bill_id):

    
    conn = sqlite3.connect("legiswatch.db")
    cursor = conn.cursor()

    # აქ ვაკეთებთ bill_id-ის მიხედვით ჩანაწერის მოძებნას ბაზაში
    cursor.execute(
        "SELECT * FROM bills WHERE bill_id = ?",
        (bill_id,)
    )

    # პირველი ნაპოვნი ჩანაწერის მიღება
    result = cursor.fetchone()
    conn.close()

    # თუ იდენტური ჩანაწერი ვერ მოიძებნა, ფუნქცია დაგვიბრუნებს False-ს
    if result is None:
        return False
    else:
        # თუ ჩანაწერი არსებობს, ფუნქცია აბრუნებს True-ს
        return True


# ამ ფუნქციით ახალ კანონპროექტს ვამატებთ ბაზაში
def insert_bill(bill_id, bill_name):

    # ჩანაწერი მხოლოდ მაშინ დაემატება, თუ bill_id ჯერ არ არსებობს ბაზაში
    if not bill_exists(bill_id):

       
        conn = sqlite3.connect("legiswatch.db")    
        cursor = conn.cursor()

        # ახალი კანონპროექტის დამატება bills ცხრილში
        cursor.execute(
            """
            INSERT INTO bills (bill_id, bill_name)
            VALUES (?, ?)
            """,(bill_id, bill_name)
        )

        
        conn.commit()
        conn.close()


# პროგრამის გაშვებისას bills ცხრილის შექმნა
create_table()