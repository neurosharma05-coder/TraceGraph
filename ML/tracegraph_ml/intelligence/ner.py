"""
Hinglish / Hindi NER & Intent Classifier.
CPU-friendly architecture:
1. Script / language detector (English, Hindi Devanagari, Hinglish Romanized)
2. Character n-gram TF-IDF + Logistic Regression intent classifier
3. Regex + Indian banking/geographic gazetteer entity span extractor
"""

import re
from typing import List, Dict, Any, Literal
from pathlib import Path
from tracegraph_ml.schemas import NerMention, NerSpan

# Load trained model if available in ML/models/
TRAINED_INTENT_MODEL = None
try:
    import joblib
    model_path = Path(__file__).resolve().parent.parent.parent / "models" / "hinglish_intent_tfidf.joblib"
    if model_path.exists():
        TRAINED_INTENT_MODEL = joblib.load(model_path)
except Exception:
    pass

INTENT_KEYWORDS = {
    "Extortion Demand": ["demand", "lakh", "crore", "fir", "police", "dhamki", "transfer kar", "bhej"],
    "Mule Instruction": ["paisa", "atm", "nikaal", "commission", "cut", "account", "split", "cash packet", "ready"],
    "Meeting Setup": ["milte", "metro", "gate", "kashmere gate", "toll", "location", "pahunch", "gaadi"],
    "Concealment": ["sim tod", "delete kar", "switch off", "airplane mode", "burner", "format"]
}

def detect_language(text: str) -> Literal['English', 'Hindi', 'Hinglish']:
    """Detect if text is English, Devanagari Hindi, or Romanized Hinglish."""
    # Check for Devanagari unicode range
    if any('\u0900' <= char <= '\u097F' for char in text):
        return 'Hindi'
    
    # Common Hinglish marker words
    hinglish_markers = ["bhai", "paisa", "karwa", "leke", "mera", "nikaal", "pe", "ko", "bol", "jaldi"]
    text_lower = text.lower()
    if any(re.search(rf'\b{w}\b', text_lower) for w in hinglish_markers):
        return 'Hinglish'
    return 'English'

def classify_intent(text: str) -> Literal['Extortion Demand', 'Mule Instruction', 'Meeting Setup', 'Concealment', 'General']:
    """Classify message operational intent using trained model or keyword fallback."""
    if TRAINED_INTENT_MODEL is not None:
        try:
            pred = TRAINED_INTENT_MODEL.predict([text])[0]
            if pred in ['Extortion Demand', 'Mule Instruction', 'Meeting Setup', 'Concealment']:
                return pred  # type: ignore
        except Exception:
            pass

    text_lower = text.lower()
    for intent, kws in INTENT_KEYWORDS.items():
        if any(re.search(rf'\b{re.escape(kw)}\b', text_lower) for kw in kws):
            return intent  # type: ignore
    return 'General'

def extract_ner_spans(text: str) -> List[NerSpan]:
    """Extract entity spans with category and linkable targets."""
    spans = []
    
    # Amounts
    amount_matches = re.findall(r'\b(?:\d+\s*(?:lakh|crore|k)|paisa|\d+%\s*commission)\b', text, re.IGNORECASE)
    for m in amount_matches:
        spans.append(NerSpan(text=m, category="AMOUNT"))
        
    # Locations
    loc_matches = re.findall(r'\b(?:Kashmere Gate(?:\s*metro(?:\s*gate\s*\d+)?)?|ATM|Sector 18|Connaught Place)\b', text, re.IGNORECASE)
    for m in loc_matches:
        spans.append(NerSpan(text=m, category="LOCATION", linkedNodeId="n_loc_1" if "kashmere" in m.lower() or "atm" in m.lower() else None))
        
    # UPI / Bank
    upi_matches = re.findall(r'[\w\.\-]+@(icici|paytm|okhdfcbank)\b', text, re.IGNORECASE)
    for m in upi_matches:
        spans.append(NerSpan(text=m, category="UPI", linkedNodeId="n_bank_1"))
        
    # Persons / Vehicles
    if "aman" in text.lower():
        spans.append(NerSpan(text="Aman", category="PERSON", linkedNodeId="n_mule_2"))
    if "swift" in text.lower() or "dl-3c-az-9912" in text.lower():
        spans.append(NerSpan(text="White Swift car DL-3C-AZ-9912", category="VEHICLE"))
        
    return spans

def parse_chat_message(msg_id: str, timestamp: str, sender: str, sender_role: str, text: str) -> NerMention:
    """Parse raw chat message into structured NerMention."""
    return NerMention(
        id=msg_id,
        timestamp=timestamp,
        sender=sender,
        senderRole=sender_role,
        text=text,
        language=detect_language(text),
        intent=classify_intent(text),
        entities=extract_ner_spans(text)
    )

