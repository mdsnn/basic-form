from sqlmodel import SQLModel, Field
from typing import Optional

class Name(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

class NameCreate(SQLModel):
    name: str
