import json
import asyncio
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.schemas.case import CaseMetadata, CaseCreateRequest, CaseUpdateRequest, SealCaseRequest
from app.services.case_service import case_service
from app.services.evidence_service import evidence_service
from datetime import datetime

router = APIRouter(prefix="/cases", tags=["Case Management"])

@router.get("/{case_id}", response_model=CaseMetadata)
def get_case(case_id: str):
    """Retrieve metadata and judicial status for an investigative case."""
    meta = case_service.get_case_meta(case_id)
    if not meta:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found.")
    return meta

@router.post("", response_model=CaseMetadata)
def create_case(req: CaseCreateRequest):
    """Registers a new investigative case in the system."""
    case_id = f"case-{len(case_service.cases_meta) + 1:03d}"
    new_case = CaseMetadata(
        id=case_id,
        caseNumber=req.caseNumber,
        title=req.title,
        description=req.description,
        investigatorName=req.investigatorName,
        investigatorBadge=req.investigatorBadge,
        agency=req.agency,
        jurisdiction=req.jurisdiction,
        dateOpened=datetime.utcnow().strftime("%Y-%m-%d"),
        status="ingesting"
    )
    case_service.cases_meta[case_id] = new_case
    return new_case

@router.post("/{case_id}/seal", response_model=CaseMetadata)
def seal_case(case_id: str, req: SealCaseRequest):
    """Cryptographically seals a case under Section 63(4) BSA 2023."""
    meta = case_service.get_case_meta(case_id)
    if not meta:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found.")
    
    latest_hash = evidence_service.get_latest_hash()
    meta.status = "sealed"
    meta.sealedAt = datetime.utcnow().isoformat() + "Z"
    meta.sealedHash = latest_hash
    return meta

@router.post("/{case_id}/run")
def run_case_pipeline(case_id: str):
    """Executes the complete multi-modal correlation and ML inference pipeline."""
    meta = case_service.get_case_meta(case_id)
    if not meta:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found.")
    return case_service.run_pipeline(case_id)

@router.get("/{case_id}/run/stream")
async def stream_case_pipeline(case_id: str):
    """Executes the pipeline with Server-Sent Events (SSE) streaming real-time stage updates."""
    meta = case_service.get_case_meta(case_id)
    if not meta:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found.")

    async def event_generator():
        for event in case_service.stream_pipeline(case_id):
            yield f"data: {json.dumps(event)}\n\n"
            await asyncio.sleep(0.02)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )

