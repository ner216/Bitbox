from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from . import models, database

router = APIRouter()

@router.get("/accounts")
def get_accounts(db: Session = Depends(database.get_db)):
    return db.query(models.Account).all()
