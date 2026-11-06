"""
Feasibility Checker (Avneesh Maurya).
Haversine great-circle distance, plausible travel velocity bounds,
uncertainty-aware time gaps, and impossible movement flags.
"""

import math
from typing import Tuple, Literal
from tracegraph_ml.schemas import FeasibilityFlag

MAX_GROUND_VELOCITY_KMH = 130.0    # Expressways
MAX_DOMESTIC_AIR_VELOCITY_KMH = 850.0  # Commercial flights

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Compute great circle distance in km between two coordinate points."""
    r = 6371.0  # Earth radius in km
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    
    a = math.sin(dphi / 2.0)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2.0)**2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return r * c

def check_travel_feasibility(
    event_a_id: str,
    event_b_id: str,
    distance_km: float,
    time_diff_minutes: float,
    city_pair: str = "Delhi to Lucknow"
) -> FeasibilityFlag:
    """Evaluate whether travel between two sightings is physically plausible."""
    if time_diff_minutes <= 0.0:
        required_speed = float('inf')
        verdict: Literal['feasible', 'unlikely', 'impossible'] = 'impossible'
    else:
        required_speed = distance_km / (time_diff_minutes / 60.0)
        if required_speed <= MAX_GROUND_VELOCITY_KMH:
            verdict = 'feasible'
        elif required_speed <= MAX_DOMESTIC_AIR_VELOCITY_KMH:
            verdict = 'unlikely'
        else:
            verdict = 'impossible'

    explanation = (
        f"{city_pair} transit of {distance_km:.1f} km across {time_diff_minutes:.1f} minutes "
        f"requires {required_speed:.1f} km/h velocity. "
        f"Flagged as {verdict.upper()} for motor vehicle transport."
    )

    return FeasibilityFlag(
        id=f"vf_{event_a_id}_{event_b_id}",
        eventAId=event_a_id,
        eventBId=event_b_id,
        distanceKm=distance_km,
        timeDiffMinutes=time_diff_minutes,
        requiredVelocityKmh=round(required_speed, 2),
        verdict=verdict,
        explanation=explanation
    )

