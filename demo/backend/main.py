from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from model.detect import predict_waste
import shutil
import os

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    file_path = f"{UPLOAD_DIR}/uploaded.jpg" 
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    result = predict_waste(file_path)
    os.remove(file_path)  
    return {"prediction": result}

