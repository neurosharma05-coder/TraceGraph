from typing import Optional, Literal
from pydantic import BaseModel, Field

class CaseMetadata(BaseModel):
    id: str = Field(..., example="case-001")
    caseNumber: str = Field(..., example="CR-2026-0942")
    title: str = Field(..., example="Operation Mule Trail — NCR Extortion Syndicate")
    description: str = Field(..., example="Multi-source digital evidence correlation across 7 channels")
    investigatorName: str = Field(..., example="ACP Vikramaditya Singh")
    investigatorBadge: str = Field(..., example="DL-CYB-042")
    agency: str = Field(..., example="Delhi Police Cyber Cell, IFSO")
    jurisdiction: str = Field(..., example="National Capital Region")
    dateOpened: str = Field(..., example="2026-02-14")
    status: Literal['draft', 'ingesting', 'sealed', 'admitted'] = Field(default='sealed')
    sealedAt: Optional[str] = Field(default=None)
    sealedHash: Optional[str] = Field(default=None)

class CaseCreateRequest(BaseModel):
    caseNumber: str
    title: str
    description: str
    investigatorName: str
    investigatorBadge: str
    agency: str
    jurisdiction: str

class CaseUpdateRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    investigatorName: Optional[str] = None
    agency: Optional[str] = None

class SealCaseRequest(BaseModel):
    investigatorBadge: str
    notes: Optional[str] = None

