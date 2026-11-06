from typing import Optional, Literal
from pydantic import BaseModel

SourceCategory = Literal['mobile', 'social', 'cctv', 'cloud', 'financial', 'email', 'network']

class ForensicFile(BaseModel):
    id: str
    name: str
    size: str
    bytes: int
    sha256: str
    parentHash: str
    sourceCategory: SourceCategory
    categoryLabel: str
    language: Literal['English', 'Hindi', 'Hinglish'] = 'English'
    clockOffset: str = "0.0s"
    cctvCounts: Optional[str] = None
    crossCaseChip: Optional[str] = None
    parseStatus: Literal['parsed', 'processing', 'flagged'] = 'parsed'
    parseProgress: int = 100
    uploadTimestamp: str
    summary: str

class EvidenceUploadResponse(BaseModel):
    fileId: str
    fileName: str
    sha256: str
    parentHash: str
    blockIndex: int
    sourceCategory: SourceCategory
    categoryLabel: str
    status: str = "sealed"
    bsaCompliance: str = "Section 63(4) Bharatiya Sakshya Adhiniyam 2023"

class HashChainVerifyResponse(BaseModel):
    isValid: bool
    totalBlocks: int
    genesisHash: str
    latestHash: str
    tamperedIndex: Optional[int] = None
    message: str
