import hashlib
import time
from datetime import datetime
from typing import List, Dict, Any

from app.schemas.audit import AuditBlock, CourtCertificateResponse
from app.services.evidence_service import evidence_service

class AuditService:
    def __init__(self):
        self.ledger: List[Dict[str, Any]] = []
        self._init_default_ledger()

    def _init_default_ledger(self):
        root = "0000000000000000000000000000000000000000000000000000000000000000"
        b1 = self.append_audit_block(
            action="EVIDENCE_SEALED",
            module="ingest",
            input_hash="d41d8cd98f00b204e9800998ecf8427e",
            output_hash="4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
            parent_hash=root
        )
        b2 = self.append_audit_block(
            action="TIME_TRUST_CALIBRATED",
            module="timetrust",
            input_hash=b1["blockHash"],
            output_hash="8f7d9a1c2b3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a",
            parent_hash=b1["blockHash"]
        )
        b3 = self.append_audit_block(
            action="MODEL_INFERENCE_COMPLETED",
            module="gnn_linking",
            input_hash=b2["blockHash"],
            output_hash="3b29c40fd3a647d7c6b9076dc5a6b47e2b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e",
            parent_hash=b2["blockHash"]
        )

    def append_audit_block(self, action: str, module: str, input_hash: str, output_hash: str, parent_hash: str) -> Dict[str, Any]:
        ts = time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime())
        raw = f"{parent_hash}|{action}|{module}|{input_hash}|{output_hash}|{ts}"
        block_hash = hashlib.sha256(raw.encode('utf-8')).hexdigest()
        
        block = {
            "timestamp": ts,
            "action": action,
            "module": module,
            "actor": "model",
            "actorLabel": "TraceGraph ML Pipeline v3.4.1",
            "inputHash": input_hash,
            "outputHash": output_hash,
            "parentHash": parent_hash,
            "blockHash": block_hash,
            "legalCompliance": "Section 63(4) Bharatiya Sakshya Adhiniyam 2023"
        }
        self.ledger.append(block)
        return block

    def get_ledger(self) -> List[AuditBlock]:
        return [AuditBlock(**b) for b in self.ledger]

    def generate_court_certificate(self, case_meta: Dict[str, Any]) -> CourtCertificateResponse:
        verification = evidence_service.verify_hash_chain()
        now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
        
        raw_sig = f"{case_meta.get('caseNumber')}|{verification['latestHash']}|{case_meta.get('investigatorBadge')}|{now_str}"
        digital_sig = hashlib.sha256(raw_sig.encode('utf-8')).hexdigest()

        return CourtCertificateResponse(
            certificateId=f"BSA-CERT-{datetime.utcnow().strftime('%Y%m%d')}-0942",
            caseNumber=case_meta.get("caseNumber", "CR-2026-0942"),
            caseTitle=case_meta.get("title", "Operation Mule Trail"),
            certifyingOfficer=f"{case_meta.get('investigatorName', 'ACP Vikramaditya Singh')} ({case_meta.get('investigatorBadge', 'DL-CYB-042')})",
            agency=case_meta.get("agency", "Delhi Police Cyber Cell, IFSO"),
            jurisdiction=case_meta.get("jurisdiction", "National Capital Region"),
            certifiedTimestamp=now_str,
            totalEvidenceFiles=verification["totalBlocks"],
            unbrokenHashChain=verification["isValid"],
            rootGenesisHash=verification["genesisHash"],
            sealedRootHash=verification["latestHash"],
            legalClause="Admissible under Section 63(4) of Bharatiya Sakshya Adhiniyam, 2023",
            digitalSignature=digital_sig
        )

audit_service = AuditService()

