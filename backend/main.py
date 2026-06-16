from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from database import (
    create_database,
    add_student,
    get_students,
    delete_student
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

create_database()

class Student(BaseModel):
    name: str = Field(min_length=1)
    juz: int = Field(ge=1, le=30)

@app.get("/")
def home():
    return {"message": "Hifz Tracker Backend Running"}

@app.post("/students")
def create_student(student: Student):
    add_student(student.name, student.juz)
    return {"message": "Student added successfully"}

@app.get("/students")
def read_students():
    return get_students()

@app.delete("/students/{student_id}")
def remove_student(student_id: int):
    delete_student(student_id)
    return {"message": f"Student {student_id} deleted successfully"}