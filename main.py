from fastapi import FastAPI
from sqlmodel import SQLModel, Session, create_engine, select
from fastapi.middleware.cors import CORSMiddleware
from models import Name, NameCreate

app = FastAPI()

# SQLite engine
engine = create_engine("sqlite:///database.db", echo=True)

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Change if using different frontend port
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create DB
@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

@app.post("/names/", response_model=Name)
def create_name(name_create: NameCreate):
    name = Name(name=name_create.name)
    with Session(engine) as session:
        session.add(name)
        session.commit()
        session.refresh(name)
    return name
