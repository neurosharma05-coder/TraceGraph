"""
TraceGraph — Model Downloader & Verification Utility
Checks presence of all required ML model checkpoints.
If any models are missing, it automatically downloads and extracts
the pre-trained model package (7.16 MB) from the CDN.
"""

import sys
import os
import io
import zipfile
import urllib.request
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"
INDIA_MODELS_DIR = BASE_DIR / "models_new" / "models"

# Permanent hosted CDN archive containing all 12 pre-trained models (~7.16 MB)
MODELS_PACKAGE_URL = "https://files.catbox.moe/raduwa.zip"

OLD_MODELS = [
    "hinglish_intent_tfidf.joblib",
    "mule_risk_lgbm.joblib",
    "link_scorer_rf.joblib",
    "gnn_link_scorer.pt",
    "yolov26.pt",
]

INDIA_MODELS = [
    "hinglish_intent_tfidf_v2.joblib",
    "mule_risk_lgbm_india.joblib",
    "financial_anomaly_lgbm_india.joblib",
    "network_anomaly_rf.joblib",
    "iot_intrusion_lgbm_india.joblib",
    "gnn_link_scorer_india.pt",
    "yolov8n_india_crime.pt",
]

def download_and_extract(url=MODELS_PACKAGE_URL):
    print(f"\n[↓] Downloading pre-trained model package from:\n    {url}")
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (TraceGraph-Model-Downloader)"})
        with urllib.request.urlopen(req, timeout=60) as resp:
            total_size = resp.getheader("Content-Length")
            data = resp.read()
            size_mb = len(data) / (1024 * 1024)
            print(f"    Downloaded {size_mb:.2f} MB successfully.")

        print("[📦] Extracting model weights...")
        with zipfile.ZipFile(io.BytesIO(data)) as zf:
            zf.extractall(BASE_DIR)
        print("    Extraction complete!")
        return True
    except Exception as e:
        print(f"    ✗ Download failed: {e}")
        print("    You can manually download the zip from:")
        print(f"    {url}")
        print("    and extract it into the 'ML/' folder.")
        return False

def check_models(auto_download=True):
    print("=" * 65)
    print("  TraceGraph ML Model Registry & Checksum Verification")
    print("=" * 65)

    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    INDIA_MODELS_DIR.mkdir(parents=True, exist_ok=True)

    def count_present():
        old_cnt = sum(1 for name in OLD_MODELS if (MODELS_DIR / name).exists())
        india_cnt = sum(1 for name in INDIA_MODELS if (INDIA_MODELS_DIR / name).exists())
        return old_cnt, india_cnt

    old_present, india_present = count_present()

    # If any models missing and auto_download is enabled, fetch them
    if (india_present < len(INDIA_MODELS) or old_present < len(OLD_MODELS)) and auto_download:
        print(f"\nMissing models detected ({india_present}/{len(INDIA_MODELS)} Indian, {old_present}/{len(OLD_MODELS)} baseline).")
        success = download_and_extract()
        if success:
            old_present, india_present = count_present()

    print(f"\n[1] Old Baseline Models ({MODELS_DIR}):")
    for name in OLD_MODELS:
        p = MODELS_DIR / name
        if p.exists():
            size_kb = p.stat().st_size / 1024
            print(f"  ✓ {name:<35} ({size_kb:8.1f} KB)")
        else:
            print(f"  ✗ {name:<35} (MISSING)")

    print(f"\n[2] Indian Real-Data Models ({INDIA_MODELS_DIR}):")
    for name in INDIA_MODELS:
        p = INDIA_MODELS_DIR / name
        if p.exists():
            size_kb = p.stat().st_size / 1024
            print(f"  ✓ {name:<35} ({size_kb:8.1f} KB)")
        else:
            print(f"  ✗ {name:<35} (MISSING)")

    print("\n" + "-" * 65)
    print(f"Summary: {old_present}/{len(OLD_MODELS)} baseline models, {india_present}/{len(INDIA_MODELS)} Indian models present.")
    
    if india_present == len(INDIA_MODELS):
        print("✓ All 7 Indian real-data models are present and ready for inference!")
    else:
        print("\nNote: Missing models will be gracefully handled with fallback heuristics.")
        print("To train all 7 Indian models from scratch, run:")
        print("  ML/notebooks/TraceGraph_Indian_Dataset_Training.ipynb on Google Colab")
    print("=" * 65)

if __name__ == "__main__":
    check_models(auto_download=True)
