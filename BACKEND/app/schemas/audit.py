from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class AuditBlock(BaseModel):
    timestamp: str
    action: str
    module: str
    actor: str
    actorLabel: str
    inputHash: str
    outputHash: str
    parentHash: str
    blockHash: str
    legalCompliance: str = "Section 63(4) Bharatiya Sakshya Adhiniyam 2023"

class AuditLedgerResponse(BaseModel):
    caseId: str
    totalBlocks: int
    hashChainValid: bool
    statutoryStandard: str = "Section 63(4) Bharatiya Sakshya Adhiniyam (BSA) 2023"
    entries: List[AuditBlock]

class CourtCertificateResponse(BaseModel):
    certificateId: str
    caseNumber: str
    caseTitle: str
    certifyingOfficer: str
    agency: str
    jurisdiction: str
    certifiedTimestamp: str
    totalEvidenceFiles: int
    unbrokenHashChain: bool
    rootGenesisHash: str
    sealedRootHash: str
    legalClause: str = "Admissible under Section 63(4) of Bharatiya Sakshya Adhiniyam, 2023"
    digitalSignature: str

