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



    

create_table()