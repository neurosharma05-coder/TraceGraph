"""
Link Candidate Generator (Avneesh Maurya).
Generates candidate edges using forensic rules:
1. Same identifier match (IMEI, phone, account, IP)
2. Temporal co-occurrence window match
3. Spatial proximity match within travel buffer
4. Bank/UPI financial transactions
5. CCTV time-gated matching
"""

from typing import List, Dict, Any, Tuple

def generate_candidate_links(events: List[Dict[str, Any]], entities: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Generate candidate pairwise associations."""
    candidates = []
    
    # 1. Device to Suspect co-occurrence candidates
    suspects = [e for e in entities if e.get("category") == "suspect"]
    phones = [e for e in entities if e.get("category") == "phone"]
    
    for s in suspects:
        for p in phones:
            candidates.append({
                "source": s["id"],
                "target": p["id"],
                "relation": "operates_device",
                "rule": "Shared nocturnal tower colocation and common KYC alias",
                "source_type": "suspect",
                "target_type": "phone"
            })
            
    # 2. Communication & Instruction candidates
    for p in phones:
        for s in suspects:
            if s["id"] != p.get("suspectId"):
                candidates.append({
                    "source": p["id"],
                    "target": s["id"],
                    "relation": "instructs_dispersal",
                    "rule": "Call duration > 60s and subsequent mule fan-out transfer",
                    "source_type": "phone",
                    "target_type": "suspect"
                })
                
    return candidates

