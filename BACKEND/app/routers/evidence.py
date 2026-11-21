from typing import List
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.schemas.evidence import ForensicFile, EvidenceUploadResponse, HashChainVerifyResponse, SourceCategory
from app.services.evidence_service import evidence_service
from app.services.audit_service import audit_service

router = APIRouter(prefix="/cases/{case_id}/evidence", tags=["Evidence Ingestion & Provenance"])

@router.get("", response_model=List[ForensicFile])
def list_evidence(case_id: str):
    """Retrieve all ingested and sealed evidence files for a case."""
    return evidence_service.list_files()

@router.post("/upload", response_model=EvidenceUploadResponse)
async def upload_evidence(
    case_id: str,
    file: UploadFile = File(...),
    source_category: SourceCategory = Form("mobile")
):
    """
    Ingests a raw digital evidence file, calculates its SHA-256 fingerprint,
    appends it to the unbroken parent-hash chain, and emits an audit block.
    """
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty evidence file rejected.")
    
    file_record = evidence_service.ingest_file(
        filename=file.filename or "unnamed_evidence.bin",
        content=content,
        category=source_category,
        case_id=case_id
    )

    # Log to Section 63(4) BSA Audit Ledger
    audit_service.append_audit_block(
        action="EVIDENCE_INGESTED",
        module="ingest",
        input_hash=file_record["sha256"],
        output_hash=file_record["sha256"],
        parent_hash=file_record["parentHash"]
    )

    return EvidenceUploadResponse(
        fileId=file_record["id"],
        fileName=file_record["name"],
        sha256=file_record["sha256"],
        parentHash=file_record["parentHash"],
        blockIndex=len(evidence_service.files_db),
        sourceCategory=file_record["sourceCategory"],
        categoryLabel=file_record["categoryLabel"]
    )

@router.get("/verify-chain", response_model=HashChainVerifyResponse)
def verify_hash_chain(case_id: str):
    """Validates the sequential SHA-256 parent-hash chain for court admissibility."""
    res = evidence_service.verify_hash_chain()
    return HashChainVerifyResponse(**res)

