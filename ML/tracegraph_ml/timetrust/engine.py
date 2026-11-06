"""
Time-Trust Engine (Avneesh Maurya).
Robust clock offset estimation from anchor events, timezone normalization,
uncertainty window propagation, and timeTrust reliability scoring.
"""

from typing import List, Tuple, Optional
import math
from tracegraph_ml.schemas import TraceEvent, TimeCorrection

def estimate_clock_offset(anchor_diffs_seconds: List[float]) -> Tuple[float, float, float]:
    """
    Robust median offset and median absolute deviation (MAD).
    Returns: (offset_seconds, uncertainty_seconds, time_trust)
    """
    if not anchor_diffs_seconds:
        return 0.0, 300.0, 0.40  # Wide uncertainty if no anchors
    
    sorted_diffs = sorted(anchor_diffs_seconds)
    n = len(sorted_diffs)
    median_offset = sorted_diffs[n // 2]
    
    deviations = sorted(abs(x - median_offset) for x in sorted_diffs)
    mad = deviations[n // 2]
    uncertainty = max(1.4826 * mad, 2.0)  # Standard normal scale factor, minimum 2s
    
    # Trust score in 0..1 decays exponentially with uncertainty
    time_trust = math.exp(-uncertainty / 60.0)
    return median_offset, uncertainty, round(time_trust, 2)

