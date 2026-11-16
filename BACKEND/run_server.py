import os
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

import uvicorn
from app.config import HOST, PORT

if __name__ == "__main__":
    print("=" * 75)
    print("  TraceGraph Dedicated Forensic Backend API")
    print("  Team def build() · SUTRAM 2026 · Problem Statement 03")
    print(f"  Listening on: http://{HOST}:{PORT}")
    print(f"  Interactive Swagger UI: http://{HOST}:{PORT}/docs")
    print("=" * 75)
    
    # Auto-ensure models are downloaded and verified
    try:
        trace_root = backend_dir.parent
        scripts_dir = trace_root / "ML" / "scripts"
        if str(scripts_dir) not in sys.path:
            sys.path.insert(0, str(scripts_dir))
        from download_models import check_models
        check_models(auto_download=True)
    except Exception as e:
        print(f"[TraceGraph Notice] Pre-trained models auto-check notice: {e}")
    
    uvicorn.run(
        "app.main:app",
        host=HOST,
        port=PORT,
        reload=False,
        log_level="info"
    )

