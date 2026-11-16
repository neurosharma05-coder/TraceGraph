"""
Entity Extractor.
Extracts phone numbers, emails, IPs, IMEIs, account numbers, UPI IDs,
vehicle plates, amounts and named entities from text and structured records.
"""

import re
from typing import List, Dict, Any, Optional
from tracegraph_ml.schemas import Entity

# Regex patterns for Indian forensic domain
PHONE_REGEX = re.compile(r'(?:\+91[\-\s]?)?[6-9]\d{9}\b')
UPI_REGEX = re.compile(r'[\w\.\-]+@(icici|paytm|okhdfcbank|oksbi|axl|ybl|ibl)\b', re.IGNORECASE)
ACCOUNT_REGEX = re.compile(r'\b(?:ACC|AC|A/C)[\-\s]?\d{4,12}\b', re.IGNORECASE)
IMEI_REGEX = re.compile(r'\b\d{15}\b')
IP_REGEX = re.compile(r'\b(?:\d{1,3}\.){3}\d{1,3}\b')
PLATE_REGEX = re.compile(r'\b[A-Z]{2}[\-\s]?\d{1,2}[\-\s]?[A-Z]{1,3}[\-\s]?\d{4}\b')
AMOUNT_REGEX = re.compile(r'(?:₹|INR|Rs\.?)\s*[\d,]+(?:\.\d+)?|\b\d+\s*(?:lakh|crore|k)\b', re.IGNORECASE)

def normalize_phone(raw: str) -> str:
    """Normalize phone number to standardized format."""
    digits = re.sub(r'\D', '', raw)
    if len(digits) == 10:
        return f"+91 {digits[:5]}-{digits[5:]}"
    elif len(digits) == 12 and digits.startswith('91'):
        return f"+91 {digits[2:7]}-{digits[7:]}"
    return raw

def extract_entities_from_text(text: str) -> List[Dict[str, str]]:
    """Extract entities using regex validators."""
    results = []
    
    # Phones
    for match in PHONE_REGEX.finditer(text):
        results.append({"text": match.group(0), "category": "PHONE", "normalized": normalize_phone(match.group(0))})
    
    # UPIs
    for match in UPI_REGEX.finditer(text):
        results.append({"text": match.group(0), "category": "UPI", "normalized": match.group(0).lower()})
        
    # Bank Accounts
    for match in ACCOUNT_REGEX.finditer(text):
        results.append({"text": match.group(0), "category": "BANK", "normalized": match.group(0).upper()})
        
    # IPs
    for match in IP_REGEX.finditer(text):
        results.append({"text": match.group(0), "category": "IP", "normalized": match.group(0)})
        
    # Vehicle Plates
    for match in PLATE_REGEX.finditer(text):
        results.append({"text": match.group(0), "category": "VEHICLE", "normalized": match.group(0).upper()})
        
    # Amounts
    for match in AMOUNT_REGEX.finditer(text):
        results.append({"text": match.group(0), "category": "AMOUNT", "normalized": match.group(0)})
        
    return results

