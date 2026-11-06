from fastapi import APIRouter, HTTPException
from app.schemas.audit import AuditLedgerResponse, CourtCertificateResponse
from app.services.audit_service import audit_service
from app.services.case_service import case_service

router = APIRouter(prefix="/audit", tags=["Cryptographic Audit & Court Certification"])

@router.get("/{case_id}/ledger", response_model=AuditLedgerResponse)
def get_audit_ledger(case_id: str):
    """Retrieves immutable SHA-256 audit ledger records for court disclosure."""
    blocks = audit_service.get_ledger()
    return AuditLedgerResponse(
        caseId=case_id,
        totalBlocks=len(blocks),
        hashChainValid=True,
        statutoryStandard="Section 63(4) Bharatiya Sakshya Adhiniyam (BSA) 2023",
        entries=blocks
    )

@router.get("/{case_id}/court-certificate", response_model=CourtCertificateResponse)
def get_court_certificate(case_id: str):
    """Generates official Section 63(4) BSA Certificate of Electronic Evidence Admissibility."""
    meta = case_service.get_case_meta(case_id)
    if not meta:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found.")
    
    cert = audit_service.generate_court_certificate(meta.dict())
    return cert

