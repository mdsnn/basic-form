from typing import List
from fastapi import FastAPI, HTTPException
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

@app.get("/names/", response_model=List[Name])
def list_names():
    with Session(engine) as session:
        names = session.exec(select(Name)).all()
        return names

@app.put("/names/{name_id}", response_model=Name)
def update_name(name_id: int, name_update: NameCreate):
    with Session(engine) as session:
        name = session.get(Name, name_id)
        if not name:
            raise HTTPException(status_code=404, detail="Name not found")

        name.name = name_update.name
        session.add(name)
        session.commit()
        session.refresh(name)
        return name

@app.delete("/names/{name_id}")
def delete_name(name_id: int):
    with Session(engine) as session:
        name = session.get(Name, name_id)
        if not name:
            raise HTTPException(status_code=404, detail="Name not found")
        session.delete(name)
        session.commit()
        return {"ok": True}
