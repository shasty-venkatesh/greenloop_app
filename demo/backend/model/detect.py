from ultralytics import YOLO

model = YOLO("model/best.pt")
SUGGESTIONS = {
    "Clothes -Biodegradable-": "Recycle or compost clothes waste if possible.",
    "Clothes Waste": "Donate or dispose of clothes in our app.",
    "Food -Biodegradable-": "Compost food waste or dispose of it in organic waste bins.",
    "Glass-Non-Biodegradable but Recyclable": "Handle with care and recycle through scheduling to our app .",
    "Hazardous Waste": "Dispose of hazardous waste at a specialized disposal facility.",
    "Medical Waste -Non-Biodegradable-": "Dispose of medical waste at designated medical waste collection sites.",
    "Metal -Non-Biodegradable but Recyclable": "Send to the nearest metal recycling center.",
    "Metal-Non-Biodegradable but Recyclable": "Send to the nearest metal recycling center.",
    "Metal-Non-Biodegradable but recyclable": "Send to the nearest metal recycling center.",
    "Paper -Biodegradable": "Recycle or compost paper waste if clean.",
    "Paper-Biodegradable": "Recycle or compost paper waste if clean.",
    "Plastic -Non-Biodegradable but Recyclable": "Avoid burning plastics, recycle properly.",
    "Plastic-Non-Biodegardable but Recyclable": "Avoid burning plastics, recycle properly.",
    "Plastic-Non-Biodegradable But Recyclable": "Avoid burning plastics, recycle properly.",
    "Plastic-Non-Biodegradable but Recyclable": "Avoid burning plastics, recycle properly.",
    "Rubber -Non-Biodegradable but Recyclable": "Send rubber to specialized recycling centers.",
    "Green Waste": "Compost green waste or dispose of it in organic waste bins.",
    "Hazard": "Handle hazardous materials with care and dispose of them in accordance with safety protocols.",
    "Paper": "Recycle or compost paper waste if clean."
}

def predict_waste(image_path):
    results = model.predict(image_path)
    if not results or results[0].boxes.cls is None:
        return {"category": "No waste detected", "suggestion": "Try another image."}
    predictions = results[0].boxes.cls.tolist()
    labels = model.names
    predicted_classes = [labels[int(cls)] for cls in predictions]
    category = predicted_classes[0] if predicted_classes else "No waste detected"
    suggestion = SUGGESTIONS.get(category, "No suggestion available")

    return {"category": category, "suggestion": suggestion}
