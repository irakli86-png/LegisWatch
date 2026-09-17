import os
import psycopg


# Railway-ის DATABASE_URL გარემოს ცვლადიდან
# ვიღებთ PostgreSQL-ის მონაცემებს
DATABASE_URL = os.getenv("DATABASE_URL")


# ვქმნით bills ცხრილს, თუ ის ჯერ არ არსებობს
def create_table():

    # ვუკავშირდებით PostgreSQL მონაცემთა ბაზას
    conn = psycopg.connect(DATABASE_URL)

    # ვქმნით cursor-ს SQL ბრძანებების შესასრულებლად
    cursor = conn.cursor()

    # ვქმნით bills ცხრილს
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS bills(
            id SERIAL PRIMARY KEY,
            bill_id INTEGER UNIQUE,
            bill_name TEXT
        )
    """)

    # ვინახავთ ცვლილებას მონაცემთა ბაზაში
    conn.commit()

    # ვხურავთ კავშირს მონაცემთა ბაზასთან
    conn.close()


# ვამოწმებთ, არსებობს თუ არა კონკრეტული bill_id მონაცემთა ბაზაში
def bill_exists(bill_id):

    # ვუკავშირდებით PostgreSQL მონაცემთა ბაზას
    conn = psycopg.connect(DATABASE_URL)

    # ვქმნით cursor-ს
    cursor = conn.cursor()

    # ვეძებთ კონკრეტულ bill_id-ს bills ცხრილში
    cursor.execute(
        "SELECT * FROM bills WHERE bill_id = %s",
        (bill_id,)
    )

    # ვიღებთ ნაპოვნ პირველ ჩანაწერს
    result = cursor.fetchone()

    # ვხურავთ კავშირს
    conn.close()

    # თუ ჩანაწერი ვერ ვიპოვეთ
    if result is None:
        return False

    # თუ ჩანაწერი არსებობს
    else:
        return True


# ვამატებთ ახალ საკანონმდებლო ინიციატივას მონაცემთა ბაზაში
def insert_bill(bill_id, bill_name):

    # ჯერ ვამოწმებთ, ხომ არ არსებობს ეს ინიციატივა
    if not bill_exists(bill_id):

        # ვუკავშირდებით PostgreSQL მონაცემთა ბაზას
        conn = psycopg.connect(DATABASE_URL)

        # ვქმნით cursor-ს
        cursor = conn.cursor()

        # ვამატებთ ახალ ჩანაწერს bills ცხრილში
        cursor.execute("""
            INSERT INTO bills (bill_id, bill_name)
            VALUES (%s, %s)
        """, (bill_id, bill_name))

        # ვინახავთ ცვლილებას მონაცემთა ბაზაში
        conn.commit()

        # ვხურავთ კავშირს
        conn.close()

        # ვატყობინებთ main.py-ს,
        # რომ ახალი ინიციატივა ნამდვილად დაემატა
        return True

    # თუ bill_id უკვე არსებობდა
    else:

        # ვატყობინებთ main.py-ს,
        # რომ ახალი ჩანაწერი არ დამატებულა
        return False