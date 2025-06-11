from fastapi import FastAPI
from app import models, database, routes

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()
app.include_router(routes.router)

@app.get("/")
def root():
    return {"message": "BitBox API running"}
