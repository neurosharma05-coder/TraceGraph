#!/usr/bin/env python3
"""
Hinglish Intent & Entity Extraction Training (Arshia Gupta).
Trains Character n-gram TF-IDF + Logistic Regression / Naive Bayes on Hinglish synthetic corpus.
Serializes model to ML/models/hinglish_intent_tfidf.joblib (<5 MB).
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report

# Seeded Hinglish training corpus based on PRD Section 4.6
TRAIN_DATA = [
    # Extortion Demand
    ("Bhai sun, total 48 lakh ka demand clear hai. jaldi karwa.", "Extortion Demand"),
    ("Ransom notice sent to CEO, 50 lakh nahi diya toh leak hoga.", "Extortion Demand"),
    ("Deadline 4 baje tak hai, 15 lakh abhi bhejo.", "Extortion Demand"),
    ("Agar case wapas nahi liya toh video social media pe daal dunga.", "Extortion Demand"),
    ("Paisa ready rakh shaam tak warna consequences dekh lena.", "Extortion Demand"),
    
    # Mule Instruction
    ("paisa bhej diya, ATM se nikaal le. Jaldi kar.", "Mule Instruction"),
    ("White Swift car DL-3C-AZ-9912 crossing toll now. Packet received, 3% commission mera deduct hai.", "Mule Instruction"),
    ("paytm-mule-902@icici pe 10 lakh split kar de 12 accounts me.", "Mule Instruction"),
    ("ATM se cash nikaal ke packet cash counter pe drop kar de.", "Mule Instruction"),
    ("Commission kaat ke baaki ka cash hawala broker ko de aana.", "Mule Instruction"),
    
    # Meeting Setup
    ("Aman ko bol Kashmere Gate metro gate 4 pe cash packet leke ready rahe.", "Meeting Setup"),
    ("Sector 18 toll gate ke peeche milte hain 9 baje.", "Meeting Setup"),
    ("DND flyover ke niche gaadi park karke wait karo.", "Meeting Setup"),
    ("Metro station ke gate number 2 pe packet courier ko de dena.", "Meeting Setup"),
    
    # Concealment
    ("Sim tod ke phek dena phone format kar le.", "Concealment"),
    ("Flight mode pe daal de phone koi normal line pe call nahi karega.", "Concealment"),
    ("Telegram chats delete kar de secret chat mode on kar.", "Concealment"),
    ("Burner device switch off karke dump yard me phek diya.", "Concealment"),
]

def train_ner_intent_model():
    print("[TraceGraph ML] Training Hinglish Intent Classification Model (CPU)...")
    texts, labels = zip(*TRAIN_DATA)
    
    # Character 3-5 gram TF-IDF pipeline (ideal for Indian code-mixed noisy spellings)
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(analyzer='char_wb', ngram_range=(3, 5), min_df=1)),
        ('clf', MultinomialNB(alpha=0.1))
    ])
    
    pipeline.fit(texts, labels)
    
    # Save model
    models_dir = Path(__file__).resolve().parent.parent / "models"
    models_dir.mkdir(parents=True, exist_ok=True)
    model_path = models_dir / "hinglish_intent_tfidf.joblib"
    joblib.dump(pipeline, model_path)
    
    print(f"[TraceGraph ML] Saved Hinglish Intent NLP model to: {model_path} ({model_path.stat().st_size / 1024:.1f} KB)")
    
    # Test sample inference
    test_phrase = "paisa bhej diya, ATM se nikaal le"
    pred = pipeline.predict([test_phrase])[0]
    print(f"[TraceGraph ML] Test Prediction: '{test_phrase}' -> Intent: '{pred}'")

if __name__ == "__main__":
    train_ner_intent_model()

