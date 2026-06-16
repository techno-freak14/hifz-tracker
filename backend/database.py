import sqlite3

DATABASE_NAME = "hifz.db"


def create_database():

    connection = sqlite3.connect(DATABASE_NAME)

    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            juz INTEGER NOT NULL
        )
    """)

    connection.commit()
    connection.close()


def add_student(name, juz):

    connection = sqlite3.connect(DATABASE_NAME)

    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO students (name, juz)
        VALUES (?, ?)
        """,
        (name, juz)
    )

    connection.commit()
    connection.close()


def get_students():

    connection = sqlite3.connect(DATABASE_NAME)

    cursor = connection.cursor()

    cursor.execute("SELECT * FROM students")

    students = cursor.fetchall()

    connection.close()

    return students
def delete_student(student_id):

    connection = sqlite3.connect(DATABASE_NAME)

    cursor = connection.cursor()

    cursor.execute(
        "DELETE FROM students WHERE id = ?",
        (student_id,)
    )

    connection.commit()
    connection.close()