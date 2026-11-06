"""
Streaming adapters and RAM working-set guard.
Enforces the hard rule: No raw datasets stored to disk.
"""

import sys
import psutil
import os
from typing import Generator, Any, Dict

RAM_LIMIT_BYTES = 2 * 1024 * 1024 * 1024  # 2 GB maximum memory guard

def check_memory_cap() -> None:
    """Assert that current process RSS memory is within the 2GB cap."""
    process = psutil.Process(os.getpid())
    rss = process.memory_info().rss
    if rss > RAM_LIMIT_BYTES:
        raise MemoryError(
            f"TraceGraph RAM guard breached: current RSS {rss / (1024*1024):.2f} MB "
            f"exceeds 2048 MB hard cap. Discarding streaming buffer."
        )

def stream_csv_chunks(url: str, chunk_size: int = 5000) -> Generator[Dict[str, Any], None, None]:
    """Stream CSV rows without saving to disk."""
    import requests
    import csv
    import io

    with requests.get(url, stream=True, timeout=30) as r:
        r.raise_for_status()
        reader = csv.DictReader(io.StringIO(r.iter_lines(decode_unicode=True)))
        count = 0
        for row in reader:
            yield row
            count += 1
            if count % chunk_size == 0:
                check_memory_cap()

