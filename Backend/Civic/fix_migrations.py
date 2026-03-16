import psycopg2

conn = psycopg2.connect(
    dbname="civic_db",
    user="postgres",
    password="Yug@5599",
    host="localhost",
    port="5432"
)

cur = conn.cursor()

# Remove NOT NULL constraint from username and allow NULL
try:
    cur.execute("""
        ALTER TABLE accounts_customuser 
        ALTER COLUMN username DROP NOT NULL
    """)
    conn.commit()
    print("Removed NOT NULL constraint from username")
except Exception as e:
    print(f"Error: {e}")
    conn.rollback()

cur.close()
conn.close()
print("Done")
