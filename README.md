# TraceGraph (TRACE)

[![TraceGraph Platform Hero](https://files.catbox.moe/wg77c4.jpg)](https://files.catbox.moe/wg77c4.jpg)
<p align="center">
  <em>Figure 1: TraceGraph Forensic Reconstruction Platform — <a href="https://files.catbox.moe/wg77c4.jpg">View Full Resolution Image</a></em>
</p>

<p align="center">
  <strong>An Automated Multi-Source Digital Forensic Correlation & Crime Reconstruction Framework</strong><br>
  Built for Indian Law Enforcement & Court Admissibility under Section 63(4) of the Bharatiya Sakshya Adhiniyam (BSA), 2023
</p>

<p align="center">
  <a href="#license"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT"></a>
  <a href="https://www.python.org"><img src="https://img.shields.io/badge/python-3.10%20%7C%203.11-3776AB.svg?logo=python&logoColor=white" alt="Python"></a>
  <a href="https://fastapi.tiangolo.com"><img src="https://img.shields.io/badge/FastAPI-0.109+-009688.svg?logo=fastapi&logoColor=white" alt="FastAPI"></a>
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-15.4-black.svg?logo=next.js&logoColor=white" alt="Next.js"></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.9-3178C6.svg?logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="#legal--statutory-compliance"><img src="https://img.shields.io/badge/Compliance-BSA%20Sec%2063(4)-15803d.svg" alt="BSA 2023 Compliant"></a>
  <a href="#-machine-learning-architecture"><img src="https://img.shields.io/badge/Training%20Data-100%25%20Indian%20Real-orange.svg" alt="Indian Data"></a>
</p>

---

## Table of Contents

- [Overview](#-overview)
- [Visual Forensic Pipelines & Architecture](#-visual-forensic-pipelines--architecture)
  - [1. Interactive Forensic Knowledge Graph (77 Nodes)](#1-interactive-forensic-knowledge-graph-77-nodes)
  - [2. Multi-Modal Network Topology & GNN Structure](#2-multi-modal-network-topology--gnn-structure)
  - [3. Computer Vision & CCTV ANPR Engine](#3-computer-vision--cctv-anpr-engine)
  - [4. Cyber-Physical & IoT Intrusion Testbed](#4-cyber-physical--iot-intrusion-testbed)
- [Machine Learning Architecture](#-machine-learning-architecture)
- [10 Integrated Investigative Modules](#-10-integrated-investigative-modules)
- [Quick Start](#-quick-start)
- [API Reference](#-api-reference)
- [Legal & Statutory Compliance](#-legal--statutory-compliance)
- [Docker Deployment](#-docker-deployment)
- [Project Structure](#-project-structure)
- [Author & License](#-author)

---

## Overview

**TraceGraph** is an industrial-grade digital forensic correlation suite designed to solve complex multi-source cybercrime investigations. Modern digital crimes rarely exist in a single silo — perpetrators orchestrate operations spanning VoIP calls, encrypted chat apps, mule bank accounts, compromised IoT nodes, and highway escape corridors.

TraceGraph ingests heterogeneous raw evidentiary artifacts, normalizes temporal drift across unsynchronized logging hardware, resolves aliases across distributed networks, and reconstructs a mathematically defensible, court-admissible narrative.

[![TraceGraph End-to-End Forensic Reconstruction Pipeline](https://files.catbox.moe/811ved.png)](https://files.catbox.moe/811ved.png)
<p align="center">
  <em>Figure 2: Complete 12-Stage Forensic Reconstruction Pipeline (Collect → Hash → Parse → Normalise → Extract Entities → Graph → Correlate → Sequence → Verify → Visualise → Report + Human in the Loop) — <a href="https://files.catbox.moe/811ved.png">View Full Resolution Image</a></em>
</p>

---

## 📐 Visual Forensic Pipelines & Architecture

### 1. Interactive Forensic Knowledge Graph (77 Nodes)

[![TraceGraph Interactive Cytoscape Graph](https://files.catbox.moe/zv8rxs.jpg)](https://files.catbox.moe/zv8rxs.jpg)
<p align="center">
  <em>Figure 3: Interactive Cytoscape Concentric Layout (77 Nodes) — Multi-Modal Entity Inspection & Radar Navigation (<a href="https://files.catbox.moe/zv8rxs.jpg">View Full Image</a>)</em>
</p>

- **Real-Time Concentric Layout:** Multi-layered rings separate primary suspects from secondary carriers, financial accounts, and IP endpoints with interactive physics forces.
- **Node Inspection Drawer:** Displays real-time carrier metadata (e.g., *Subscriber 7590-VHVEG*, account contracts, CDR records) backed by 95% GNN association confidence.
- **Radar Minimap:** Facilitates rapid navigation across massive 70+ node investigative graphs.
- **Multi-Modal Color Coding:** Direct visual differentiation for Suspects (Red), Phone/CDR (Green), Bank/UPI (Yellow), IP/Cloud (Purple), and CCTV (Pink).

---

### 2. Multi-Modal Network Topology & GNN Structure

[![Multi-Modal Network Topology](https://files.catbox.moe/b6x31f.png)](https://files.catbox.moe/b6x31f.png)
<p align="center">
  <em>Figure 4: Multi-Source Topological Mapping (Star, Ring, Router & Criminal Clique Subgraphs) (<a href="https://files.catbox.moe/b6x31f.png">View Full Image</a>)</em>
</p>

TraceGraph maps heterogeneous crime structures into formal topological representations:
- **Topology Structuring:** Converts cellular towers (star clusters `C1N0-C1N9`), peer-to-peer money transfers (rings `C2N0-C2N9`), routing infrastructure (backbone switches `C1SW-C5SW`), and criminal collusion syndicates (dense cliques `C5N0-C5N9`) into structured entities.
- **Graph Neural Network (GNN) Link Scoring:** Employs a 2-layer **GraphSAGE** model (`16 → 64 → 32`) to compute likelihood embeddings across latent suspect-to-event relationships.
- **Neo4j Cypher Integration:** Streams nodes (`Case`, `ForensicNode`, `TimelineEvent`) and edges (`FORENSIC_LINK`) in real-time, backed by Cytoscape.js canvas rendering.

---

### 3. Computer Vision & CCTV ANPR Engine

[![CCTV Surveillance & ANPR Keyframe Detection](https://files.catbox.moe/dkm3p6.jpg)](https://files.catbox.moe/dkm3p6.jpg)
<p align="center">
  <em>Figure 5: Real-World Indian Traffic Camera Keyframes — Vehicle Detection across Day, Dusk & Night Illumination (<a href="https://files.catbox.moe/dkm3p6.jpg">View Full Image</a>)</em>
</p>

The visual intelligence subsystem processes uncalibrated CCTV footage across challenging Indian lighting environments:
- **Multi-Illumination Vehicle & Object Detection:** Detects suspect vehicles (cars, freight trucks, buses, auto-rickshaws) across day, twilight, and severe low-light night corridors using fine-tuned **YOLOv8n**.
- **Automated License Plate Recognition (ANPR):** Performs bilateral noise filtering and Otsu adaptive thresholding before applying Tesseract OCR to extract Indian high-security registration plates (`DL-3C-AZ-9912`).
- **Camera Metadata Alignment:** Calibrates embedded camera telemetry (timestamp, temperature, sensor compass angle) to reconcile spatial waypoints with cellular CDR records.

---

### 4. Cyber-Physical & IoT Intrusion Testbed

[![IoT & Network Packet Capture Architecture](https://files.catbox.moe/udjcxi.jpg)](https://files.catbox.moe/udjcxi.jpg)
<p align="center">
  <em>Figure 6: Cyber-Physical IoT & Wireshark PCAP Capture Testbed Architecture (<a href="https://files.catbox.moe/udjcxi.jpg">View Full Image</a>)</em>
</p>

TraceGraph incorporates a comprehensive cyber-physical surveillance and network analysis engine trained on real-world Indian university testbed data:
- **Physical Sensor & Edge Broker Layer:** Accommodates telemetry from ESP32 microcontrollers (air quality, dust, temperature, ultrasonic, camera) and Raspberry Pi edge nodes communicating via MQTT, CoAP, and AMQP.
- **Network Tap & Port Mirroring:** Ingests live Wireshark PCAPs captured from managed L2 switches, monitoring workstation traffic, mobile endpoints, and simulated Kali attack vectors.
- **16-Class Attack Classification:** Evaluates 105 protocol flow features using **LightGBM** to flag DoS, DDoS, brute-force, scan, and data exfiltration patterns in milliseconds.

---

##  Machine Learning Architecture

TraceGraph rejects synthetic toy datasets in production. All 7 production models are trained exclusively on authentic Indian forensic data:

| § | Model Subsystem | Architecture | Training Dataset | Benchmark Metrics | Active Endpoint |
|---|-----------------|--------------|------------------|-------------------|-----------------|
| **§1** | **Hinglish Vernacular NLP** | Sub-word TF-IDF + Calibrated Logistic Regression | PoliWAM (3,848 real Hindi-English messages) | **77.9% Accuracy** (9 political classes) | `POST /ml/india/predict/intent` |
| **§2** | **UPI Mule Account Risk** | LightGBM Classifier (300 trees, 6 features) | NPCI Monthly Statistics (Apr 2019 – Dec 2024) | **0.7835 Risk Confidence** | `POST /ml/india/predict/mule` |
| **§3** | **Bank Statement Anomaly** | Isolation Forest + StandardScaler | AgamiAI Indian Bank Statements | **1.00 Anomaly Prob** (High Severity) | `POST /ml/india/predict/anomaly` |
| **§4** | **PCAP Network Anomaly** | Calibrated Random Forest (100 estimators) | VIT Bhopal Cyberattack Dataset (600K packets) | **87.0% Detection Rate** | `POST /ml/india/predict/network` |
| **§5** | **IoT Intrusion Detector** | LightGBM Multi-class (400 trees, 105 features) | MU-IoT Manipur University (393K samples) | **16 Attack Vectors** | `POST /ml/india/predict/iot` |
| **§6** | **CCTV / ANPR Vision** | Ultralytics YOLOv8n + OpenCV + OCR | Indian Traffic Feeds + Snatch 1.0 Dataset | **96.20% mAP@50** | `POST /ml/india/predict/cctv` |
| **§7** | **Forensic Link Scorer** | PyTorch GraphSAGE Link Scorer (`16 → 64 → 32`) | Multi-Source Indian Forensic Crime Graph | **95.58% Accuracy** | `POST /ml/india/predict/link-india` |

### 📥 Auto-Download Pre-Trained Weights

For users cloning from GitHub or downloading the repository `.ZIP` archive, model weights are excluded from Git to keep the repository lightweight. You can auto-fetch and verify all models (7.16 MB package) with one command:

```sh
# Verify or auto-download all pre-trained models
python ML/scripts/download_models.py
```

Starting the backend with `python run_server.py` also automatically verifies and fetches any missing weights on first launch.

---

## 🏛️ 10 Integrated Investigative Modules

TraceGraph's web console organizes forensic investigations into 10 dedicated, sequential screens accessible via the unified module switcher:

[![TraceGraph 10 Module Forensic Console Navigation](https://files.catbox.moe/yt0430.png)](https://files.catbox.moe/yt0430.png)
<p align="center">
  <em>Figure 7: TraceGraph Unified Forensic Console Navigation Bar — Seamless switching across all 10 investigative stages (<a href="https://files.catbox.moe/yt0430.png">View Full Resolution Image</a>)</em>
</p>

1. **New Case Upload (01):** Drag-and-drop evidence vault with immediate client-side SHA-256 calculation.
2. **Evidence Vault (02):** Cryptographic parent-hash chain viewer ensuring zero evidence tampering.
3. **Knowledge Graph (03):** Interactive visual property graph displaying suspect-to-evidence relationships.
4. **Unified Timeline (04):** Chronological event stream with hardware RTC clock drift compensation.
5. **Geospatial Map (05):** Interactive Leaflet GPS map tracking cell tower CDRs, IP geolocations, and vehicle sightings.
6. **Spatio-Temporal Feasibility (06):** Physical road/air velocity vector validation uncovering impossible alibis.
7. **Entity Resolution (07):** Multi-modal identity clustering merging IMEIs, Phone Numbers, VPAs, and IP addresses.
8. **Cross-Case Intelligence (08):** Automated similarity matching against national police cold case databases.
9. **Hypothesis Builder (09):** Dynamic Beam Search scoring Prosecution Theory Alpha against Defense Alibi Beta.
10. **Court Certificate (10):** Legally admissible, print-ready evidence report under Section 63(4) BSA 2023.

---

##  Quick Start

### Prerequisites
- **Python**: 3.10 or 3.11
- **Node.js**: v18.0.0 or higher (`npm v9+`)
- **Git**

### 1. Clone the Repository
```sh
git clone https://github.com/YOUR_USERNAME/TRACE.git
cd TRACE
```

### 2. Launch the Backend API (FastAPI)
```sh
cd BACKEND
pip install -r requirements.txt
python run_server.py
```
- Server launches on **`http://127.0.0.1:8001`**
- Interactive OpenAPI Documentation (Swagger UI): **`http://127.0.0.1:8001/docs`**

### 3. Launch the Frontend Console (Next.js)
```sh
cd ../FRONTEND
npm install
npm run dev
```
- Web Application launches on **`http://localhost:3000`**
- Direct Console Access: **`http://localhost:3000/console`**

---

##  API Reference

All Indian Machine Learning inference routes are exposed under `/ml/india/predict/*`:

### 1. Hinglish Threat & Intent Classification
```sh
curl -X POST http://127.0.0.1:8001/ml/india/predict/intent \
  -H "Content-Type: application/json" \
  -d '{"text": "paisa bhej de jaldi ATM se"}'
```

### 2. NPCI UPI Mule Account Risk Detection
```sh
curl -X POST http://127.0.0.1:8001/ml/india/predict/mule \
  -H "Content-Type: application/json" \
  -d '{"volume_mn": 14439.73, "value_cr": 20637.0, "month_num": 3, "year": 2024}'
```

### 3. Bank Statement Financial Anomaly
```sh
curl -X POST http://127.0.0.1:8001/ml/india/predict/anomaly \
  -H "Content-Type: application/json" \
  -d '{"features": {"opening_balance": 9500000, "closing_balance": 100, "interest_rate": 0.0}}'
```

### 4. Network Packet Attack Classifier
```sh
curl -X POST http://127.0.0.1:8001/ml/india/predict/network \
  -H "Content-Type: application/json" \
  -d '{"length": 1480, "ttl": 45, "src_port": 50000, "dst_port": 23, "protocol_code": 6}'
```

---

##  Legal & Statutory Compliance

TraceGraph was constructed from the ground up to comply with Indian and international forensic jurisprudence:

- **Section 63(4) Bharatiya Sakshya Adhiniyam (BSA), 2023:** Replaces the former Section 65B of the Indian Evidence Act. Generates cryptographically sealed, court-admissible electronic records documenting software versions, hash integrity, hardware states, and custodian signatures.
- **CASE / UCO Ontology:** Emits native W3C RDF Turtle (`.ttl`) triples adhering to the Cyber-investigation Analysis Standard Expression.
- **Immutable SHA-256 Chain of Custody:** Calculates client-side hashes upon file ingestion and links every block digest, providing definitive proof against evidence tampering.
- **Physical Time-Trust Hardware Model:** Corrects RTC drift across unsynchronized logging devices against authoritative NTP references before sequencing crime timelines.

---

##  Docker Deployment

To spin up the entire distributed infrastructure (FastAPI backend, Next.js frontend, and optional Neo4j instance) via Docker:

```sh
docker-compose up --build
```

| Service | Container Port | External URL | Role |
|---------|----------------|--------------|------|
| **`backend`** | 8001 | `http://localhost:8001` | FastAPI Python API + 7 India ML Bridges |
| **`frontend`** | 3000 | `http://localhost:3000` | Next.js 15 Forensic Console Dashboard |
| **`neo4j`** | 7474 / 7687 | `http://localhost:7474` | Cypher Property Graph Database (Optional) |

---

##  Project Structure

```
TRACE/
├── assets/                                 # Architectural schematics, UI hero, & testbed diagrams
│   ├── tracegraph-hero.jpg                 # Figure 1: Main landing UI banner
│   ├── tracegraph-pipeline-workflow.png    # Figure 2: 12-Stage reconstruction pipeline diagram
│   ├── tracegraph-interactive-graph.jpg    # Figure 3: Interactive Cytoscape graph view (77 nodes)
│   ├── graph-topology-network.png          # Figure 4: Multi-modal network & GNN topology diagram
│   ├── cctv-surveillance-detection.jpg     # Figure 5: CCTV keyframe & license plate detection
│   ├── iot-network-testbed.jpg             # Figure 6: Physical IoT & PCAP testbed architecture
│   └── tracegraph-modules-navbar.png       # Figure 7: 10 Integrated investigative console navigation
│
├── BACKEND/                                # FastAPI Python Microservice (Port 8001)
│   ├── app/
│   │   ├── main.py                         # Application entry point & route mounting
│   │   ├── config.py                       # Environment configurations & model directory paths
│   │   ├── routers/
│   │   │   ├── cases.py                    # Case ingestion, pipeline execution & graph endpoints
│   │   │   ├── ml.py                       # Baseline ML endpoints (/ml/predict/*)
│   │   │   ├── india_ml.py                 # 🇮🇳 Indian real-data ML endpoints (/ml/india/predict/*)
│   │   │   └── audit.py                    # BSA 2023 court certificate & immutable audit ledger
│   │   └── services/
│   │       ├── india_ml_bridge.py          # Loader & inference bridge for 7 Indian models
│   │       ├── ml_bridge.py                # Loader for baseline PaySim/Elliptic models
│   │       ├── neo4j_service.py            # Neo4j Cypher streaming with offline fallback
│   │       └── audit_service.py            # SHA-256 cryptographic chain-of-custody engine
│   ├── requirements.txt                    # Python dependencies
│   └── run_server.py                       # Standalone uvicorn launcher
│
├── FRONTEND/                               # Next.js 15 App Router Frontend (Port 3000)
│   ├── src/
│   │   ├── api/
│   │   │   ├── backendClient.ts            # Typed client for all Backend & India ML endpoints
│   │   │   └── evidenceClient.ts           # Evidence upload & hash verification client
│   │   ├── app/                            # Next.js pages & console routes
│   │   ├── components/                     # UI components (CytoscapeGraph, LeafletMap, ConsoleShell)
│   │   ├── pages/                          # 10 investigative module page components
│   │   └── store/                          # Zustand forensic state stores
│   ├── package.json                        # Node.js dependencies
│   └── tsconfig.json                       # TypeScript configuration
│
├── ML/                                     # Machine Learning Pipeline & Notebooks
│   ├── models/                             # Baseline models (synthetic/PaySim) [git-ignored]
│   ├── models_new/models/                  # 7 Indian real-data models [git-ignored]
│   ├── notebooks/                          # Google Colab execution & training notebooks
│   │   ├── TraceGraph_Indian_Dataset_Training.ipynb
│   │   └── TraceGraph_CCTV_YOLO_OCR_Pipeline.ipynb
│   └── scripts/
│       └── download_models.py              # Checksum verifier and model downloader
│
├── EVIDENCE_SAMPLES/                      # 7 Authentic forensic sample files
├── docker-compose.yml                      # Multi-container orchestration
├── .gitignore                              # Clean production ignore rules (model weights excluded)
└── README.md                               # Documentation
```

## 👤 Author

**Anubhav Sharma** ([@neurosharma05-coder](https://github.com/neurosharma05-coder))
- Creator & Lead Architect of TraceGraph

## 📄 License

This project is licensed under the [MIT License](LICENSE).
