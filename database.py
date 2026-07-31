import sqlite3

def create_table():

    conn = sqlite3.connect('legiswatch.db')

    cursor = conn.cursor()

    cursor.execute("""CREATE TABLE IF NOT EXISTS bills(
                   id INTEGER PRIMARY KEY AUTOINCREMENT,
                   bill_id INTEGER UNIQUE,
                   bill_name TEXT
                )

    """)

    conn.commit()

def bill_exists(bill_id):
    conn = sqlite3.connect('legiswatch.db')
    cursor = conn.cursor()
        
    cursor.execute("""SELECT * FROM bills WHERE bill_id =?""", (bill_id,))

    result = cursor.fetchone()
    conn.close()
    if result is None:
        return False
    else:
        return True

def insert_bill(bill_id,bill_name):
    
    if not bill_exists(bill_id):
        conn = sqlite3.connect('legiswatch.db')
        cursor = conn.cursor()
        cursor.execute("""INSERT INTO bills (bill_id,bill_name)
                          VALUES (?,?)""", (bill_id,bill_name,))
    
        conn.commit()
        conn.close()
    

create_table()