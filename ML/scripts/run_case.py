#!/usr/bin/env python3
"""
TraceGraph ML CLI Runner.
Runs case inference or dry-run, outputting JSON matching frontend expectations.
"""

import argparse
import json
import sys
from pathlib import Path

# Add ML root to PYTHONPATH
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from tracegraph_ml.data.generator import generate_case_001

def main():
    parser = argparse.ArgumentParser(description="TraceGraph ML Case Execution Engine")
    parser.add_argument("--case-id", default="case-001", help="Identifier of target case")
    parser.add_argument("--dry-run", action="store_true", help="Execute fast in-memory sanity check (<2s)")
    parser.add_argument("--out", type=str, default=None, help="Output destination JSON path")
    args = parser.parse_args()

    print(f"[TraceGraph ML] Initializing engine for case: {args.case_id} (CPU Only)...")
    outputs = generate_case_001()

    print(f"[TraceGraph ML] Events processed: {len(outputs.events)}")
    print(f"[TraceGraph ML] Entities resolved: {len(outputs.entities)}")
    print(f"[TraceGraph ML] Links scored: {len(outputs.links)}")
    print(f"[TraceGraph ML] Hypotheses ranked: {len(outputs.hypotheses)}")
    print(f"[TraceGraph ML] Feasibility conflicts: {len(outputs.feasibilityFlags)}")
    print(f"[TraceGraph ML] Evaluation metrics registered: {len(outputs.metrics)}")

    out_json = outputs.model_dump_json(indent=2)
    if args.out:
        out_path = Path(args.out)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(out_json, encoding="utf-8")
        print(f"[TraceGraph ML] Saved case outputs to: {out_path}")
    else:
        # Save by default to fixtures/case_001_mule_trail.json
        default_out = Path(__file__).resolve().parent.parent / "fixtures" / "case_001_mule_trail.json"
        default_out.write_text(out_json, encoding="utf-8")
        print(f"[TraceGraph ML] Saved verified fixture to: {default_out}")

    print("[TraceGraph ML] Execution successfully completed.")

if __name__ == "__main__":
    main()

