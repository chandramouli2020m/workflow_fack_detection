from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import easyocr
import cv2
import numpy as np
from deepface import DeepFace
import os

app = FastAPI(title="Border Security AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Loading OCR Model...")
reader = easyocr.Reader(['en'])
print("Models Ready!")

# --- MODULES 1, 2, & 3: OCR and Tampering Detection ---
@app.post("/api/scan-document")
async def scan_document(doc_type: str = Form(...), file: UploadFile = File(...)):
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Module 1 & 2: Text Extraction
        extracted_text_list = reader.readtext(img, detail=0)
        raw_text = " ".join(extracted_text_list)

        # Module 3: Tampering Detection (Forensic Edge Density Analysis)
        # Highly tampered images often have harsh, irregular pixel edges
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 100, 200)
        edge_density = np.sum(edges) / (edges.shape[0] * edges.shape[1] * 255)
        
        # Calculate Risk Score (0.0 to 1.0)
        tampering_score = min(edge_density * 10, 1.0)
        verdict = "Clear" if tampering_score < 0.4 else "Flagged: High Tampering Risk"

        return {
            "status": "success",
            "extracted_text": raw_text,
            "tampering_score": round(tampering_score, 2),
            "verdict": verdict
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

# --- MODULE 4: Face Verification ---
@app.post("/api/verify-face")
async def verify_face(
    live_image: UploadFile = File(...),
    document_image: UploadFile = File(...)
):
    try:
        # Save temp files for DeepFace to process
        with open("temp_live.jpg", "wb") as f:
            f.write(await live_image.read())
        with open("temp_doc.jpg", "wb") as f:
            f.write(await document_image.read())

        # Run Facial Verification
        result = DeepFace.verify("temp_live.jpg", "temp_doc.jpg", model_name="Facenet")
        
        # Clean up temp files
        os.remove("temp_live.jpg")
        os.remove("temp_doc.jpg")

        return {
            "status": "success",
            "match": result["verified"],
            "confidence_score": round(result["distance"], 2) # Lower distance = better match
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}