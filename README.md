  # TraceGraph (TRACE)

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python: 3.11](https://img.shields.io/badge/python-3.11-3776AB.svg?logo=python&logoColor=white)](https://www.python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js: 15.4](https://img.shields.io/badge/Next.js-15.4-black.svg?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript: 5.9](https://img.shields.io/badge/TypeScript-5.9-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Security: Hardened](https://img.shields.io/badge/Security-Hardened%20%26%20Isolated-red.svg)](#security--anti-tamper-architecture)
[![Compliance: BSA 2023](https://img.shields.io/badge/Compliance-BSA%20Sec%2063(4)-15803d.svg)](#legal--statutory-compliance)
[![Training Data: Indian Real](https://img.shields.io/badge/Training%20Data-100%25%20Indian%20Real-orange.svg)](#machine-learning-architecture--core-features)

  [![TraceGraph Platform Hero](https://files.catbox.moe/wg77c4.jpg)](https://files.catbox.moe/wg77c4.jpg)
  <p align="center">
    <em>Figure 1: TraceGraph Forensic Reconstruction Platform — <a href="https://files.catbox.moe/wg77c4.jpg">View Full Resolution Image</a></em>
  </p>

An automated multi-source digital forensic correlation and crime reconstruction framework built for Indian law enforcement, cyber defense teams, and judicial admissibility under **Section 63(4) of the Bharatiya Sakshya Adhiniyam (BSA), 2023**.

  ---

```sh
# Clone & run TraceGraph in 2 steps
git clone https://github.com/neurosharma05-coder/TRACE.git
cd TRACE && docker-compose up --build
```

  ---

## What it does

TraceGraph solves complex multi-source cybercrime investigations by ingesting heterogeneous raw evidentiary artifacts, reconciling hardware clock drift, resolving entity aliases across distributed networks, and generating court-admissible forensic reconstructions:

- **12-Stage Reconstruction Pipeline:** Ingests, hashes, parses, normalizes, correlates, and reports digital evidence end-to-end.
- **7 Production Indian ML Models:** Trained on authentic Indian crime datasets (PoliWAM, NPCI, AgamiAI, VIT Bhopal, MU-IoT, Indian Traffic Feeds, Indian Forensic Graph).
- **Interactive Knowledge Graph:** Cytoscape.js 77-node interactive canvas with multi-modal physics forces, suspect clustering, and radar navigation.
- **Physical Spatio-Temporal Velocity Engine:** Calculates Haversine distances to mathematically flag impossible travel speeds (>300 km/h).
- **CCTV & ANPR Vision Intelligence:** YOLOv8n object detection coupled with EasyOCR and Tesseract for license plate recognition in uncalibrated Indian lighting.
- **Automated PCAP Packet Forensics:** Decodes `.pcap` streams with `dpkt` to classify 16 network attack classes in real-time.
- **Section 63(4) BSA 2023 Court Certificate:** Automatically compiles print-ready, cryptographically verifiable forensic certificates.

[![TraceGraph End-to-End Forensic Reconstruction Pipeline](https://files.catbox.moe/811ved.png)](https://files.catbox.moe/811ved.png)
<p align="center">
  <em>Figure 2: Complete 12-Stage Forensic Reconstruction Pipeline — <a href="https://files.catbox.moe/811ved.png">View Full Resolution Image</a></em>
</p>

  ---

## System Requirements & Prerequisites

| Requirement | Minimum | Recommended | Notes |
|-------------|---------|-------------|-------|
| **Operating System** | Windows 10, Ubuntu 20.04+, macOS 12+ | Windows 11 / Ubuntu 22.04 LTS | Cross-platform |
| **Python** | 3.10 | 3.11 | Python 3.11 is strongly recommended |
| **Node.js** | v18.0.0 | v20 LTS | Required for Next.js 15 |
| **npm** | v9.0.0 | v10+ | Bundled with Node.js |
| **RAM** | 8 GB | 16 GB | Necessary for concurrent YOLOv8 + LightGBM |
| **Disk Space** | 5 GB free | 10 GB free | For packages, models, and evidence cache |
| **GPU** | Not required | NVIDIA CUDA 12+ (Optional) | All ML models run smoothly on CPU |

### System Software Libraries

- **Git:** Version control (`https://git-scm.com`)
- **Tesseract OCR (Optional for ANPR):** 
  - *Windows:* Install from [UB-Mannheim Tesseract](https://github.com/UB-Mannheim/tesseract/wiki) to `C:\Program Files\Tesseract-OCR`.
  - *Ubuntu / Debian:* `sudo apt-get install -y tesseract-ocr tesseract-ocr-hin`
  - *macOS:* `brew install tesseract`
  *(Note: EasyOCR is embedded as an automated neural fallback).*

  ---

## Dependencies

### Backend Python Packages (`BACKEND/requirements.txt`)

```text
# Web Framework
fastapi>=0.109.0
uvicorn>=0.27.0
pydantic>=2.5.0
python-multipart>=0.0.6

  # Machine Learning Core
  numpy>=1.24.0
  joblib>=1.3.0
  scikit-learn>=1.3.0
  lightgbm>=4.0.0
  torch>=2.0.0

  # Computer Vision & OCR
  ultralytics>=8.0.0        # YOLOv8 object & plate detection
  opencv-python>=4.8.0      # Image processing, bilateral filter, Otsu thresholding
  pytesseract>=0.3.10       # Tesseract OCR Python bridge

  # Real-Time Intelligence & Geolocation
  geoip2>=4.8.0             # MaxMind GeoLite2 offline IP geolocation
  httpx>=0.27.0             # Async HTTP client for AbuseIPDB & ipinfo.io

  # Persistent Database Storage
  sqlalchemy>=2.0.0         # ORM for Case, Node, Link, Timeline persistence
  aiosqlite>=0.20.0         # SQLite async engine

  # Network Packet Forensics
  dpkt>=1.9.8               # High-speed PCAP packet parser

# Image EXIF Extraction
Pillow>=10.0.0            # GPS telemetry extraction from photo evidence

# Graph Database (Optional)
neo4j>=5.0.0
```

### Frontend Node.js Packages (`FRONTEND/package.json`)

  ```json
  {
    "dependencies": {
      "next": "^15.4.9",
      "react": "^19.2.1",
      "react-dom": "^19.2.1",
      "typescript": "5.9.3",
      "cytoscape": "^3.34.4",
      "leaflet": "^1.9.4",
      "recharts": "^3.10.1",
      "zustand": "^5.0.16",
      "lucide-react": "^0.553.0",
      "motion": "^12.23.24",
      "tailwindcss": "4.1.11",
      "@google/genai": "^2.4.0"
    }
  }
  ```

---

## How to Create & Configure Third-Party APIs

TraceGraph is engineered with **offline-first determinism**: if you do not register third-party API keys, the system executes successfully using built-in forensic fallbacks without errors.

To unlock live external threat intelligence and city-level geolocation, register for the following free services:

### 1. MaxMind GeoLite2 City Database (IP Geolocation)
1. Go to [MaxMind GeoLite2 Sign Up](https://www.maxmind.com/en/geolite2/signup) and create a free account.
2. Log in and navigate to **Account → Download Databases**.
3. Download the **GeoLite2 City** binary archive (GZIP format).
4. Extract `GeoLite2-City.mmdb` and place it in your local folder:
   ```
   BACKEND/data/GeoLite2-City.mmdb
   ```
5. Confirm `GEOIP_DB_PATH=data/GeoLite2-City.mmdb` in `BACKEND/.env`.
*(Fallback if omitted: Maps to national geographic center at `20.5937, 78.9629`).*

### 2. AbuseIPDB API Key (IP Threat & Reputation Scoring)
1. Visit [AbuseIPDB Registration](https://www.abuseipdb.com/register) and create a free account.
2. Verify your email and log in to the dashboard.
3. Click on **Account → API** and select **Create Key**.
4. Set a name (e.g. `TraceGraph-Local`) and copy the generated key string.
5. In `BACKEND/.env`, paste your key:
   ```env
   ABUSEIPDB_API_KEY=your_copied_abuseipdb_key
   ```
*(Free tier provides 1,000 checks/day. Fallback if omitted: Neutral score `0.50`).*

### 3. ipinfo.io Token (ISP & Organization Resolution)
1. Navigate to [ipinfo.io Sign Up](https://ipinfo.io/signup) and create a free account.
2. Once logged in, your API Access Token is displayed on the main dashboard.
3. In `BACKEND/.env`, paste your token:
   ```env
   IPINFO_TOKEN=your_copied_ipinfo_token
   ```
*(Free tier includes 50,000 lookups/month. Fallback if omitted: Uses raw IP as canonical label).*

  ---

## Installation & Setup

### 1. Clone the Repository

```sh
git clone https://github.com/neurosharma05-coder/TRACE.git
cd TRACE
```

### 2. Configure Environment Variables (`.env`)

Generate your local backend environment configuration from the template:

```sh
# On Windows PowerShell:
Copy-Item BACKEND\.env.example BACKEND\.env

# On Linux / macOS:
cp BACKEND/.env.example BACKEND/.env
```

Your `BACKEND/.env` file will contain safe default loopback bindings:

  ```env
  # Server Binding
  TRACE_BACKEND_HOST=127.0.0.1
  TRACE_BACKEND_PORT=8001
  CORS_ORIGIN=http://localhost:3000

# IP Geolocation & Threat Intelligence (Optional)
GEOIP_DB_PATH=data/GeoLite2-City.mmdb
ABUSEIPDB_API_KEY=
IPINFO_TOKEN=

  # Persistent Forensic Database (Local SQLite)
  DATABASE_URL=sqlite:///./trace.db

# Neo4j Property Graph (Optional)
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=forensic_password
```

### 3. Install Backend Dependencies

  ```sh
  cd BACKEND
  pip install -r requirements.txt
  ```

### 4. Verify & Download ML Model Weights

Verify model weights or auto-download pre-trained checkpoints (7.16 MB package):

```sh
python ../ML/scripts/download_models.py
```

### 5. Install Frontend Dependencies

  ```sh
  cd ../FRONTEND
  npm install
  ```

  ---

## Execution Steps

### 1. Start the Backend API (FastAPI)

  ```sh
  cd BACKEND
  python run_server.py
  ```

```text
[IndiaBridge] Loading from: .../ML/models_new/models
[IndiaBridge] ✓ Hinglish NLP v2 (PoliWAM) loaded
[IndiaBridge] ✓ Mule Risk LightGBM (NPCI UPI) loaded
[IndiaBridge] ✓ Financial Anomaly (AgamiAI) loaded
[IndiaBridge] ✓ Network Anomaly RF (VIT Bhopal) loaded
[IndiaBridge] ✓ IoT Intrusion LightGBM (MU-IoT) loaded
[IndiaBridge] ✓ YOLOv8n loaded
[IndiaBridge] ✓ GNN India state loaded
INFO:     Uvicorn running on http://127.0.0.1:8001
```

- **Backend Gateway:** `http://127.0.0.1:8001`
- **Interactive OpenAPI Documentation:** `http://127.0.0.1:8001/docs`

### 2. Start the Frontend Console (Next.js)

  Open a second terminal window:

  ```sh
  cd FRONTEND
  npm run dev
  ```

- **Web Console Dashboard:** `http://localhost:3000`
- **Direct Investigative Console:** `http://localhost:3000/console`

### 3. Docker Deployment (All-in-One)

To launch the backend, frontend, and an optional Neo4j instance in isolated containers:

  ```sh
  docker-compose up --build
  ```

| Service | Container Port | External URL | Role |
|---------|----------------|--------------|------|
| **`backend`** | 8001 | `http://localhost:8001` | FastAPI Python API + 7 India ML Bridges |
| **`frontend`** | 3000 | `http://localhost:3000` | Next.js 15 Forensic Console Dashboard |
| **`neo4j`** | 7474 / 7687 | `http://localhost:7474` | Cypher Property Graph Database (Optional) |

  ---

## Usage Guidelines & Operational Workflow

### Phase 1: Registering a New Investigation
1. Navigate to `http://localhost:3000/console`.
2. On **Module 01 (New Case Upload)**, fill in the official legal case metadata:
   - **Case Title** (e.g. *NCR Cyber-Financial Extortion Syndicate*)
   - **Case / FIR Number** (e.g. *CR-2026-0942*)
   - **Lead Investigator Name & Rank**
   - **Officer Badge ID**
   - **Agency & Jurisdiction**
3. Click **Continue to Step 2 (Evidence Ingestion)**.

### Phase 2: Ingesting & Cryptographically Sealing Evidence
Drag and drop evidentiary files into the appropriate source vault:
- **Mobile Device & CDR:** Call records, cellular frequency dumps (`.csv`, `.ufed`, `.db`).
- **Social Media & Chats:** WhatsApp / Telegram Hinglish message dumps (`.txt`, `.json`).
- **CCTV & Video Surveillance:** Highway toll or checkpoint `.mp4` feeds.
- **Financial & Bank Records:** UPI transaction ledgers and bank statements (`.csv`, `.xlsx`).
- **Network & Proxy Logs:** Packet captures (`.pcap`, `.pcapng`).

*Each uploaded container is immediately hashed via SHA-256 client-side and bound to the cryptographic parent-hash chain.*

### Phase 3: Triggering Automated Real-Time ML Correlation
1. Click **▶ Run Full Forensic Pipeline**.
2. The 7 sequential pipeline stages execute across your ingested artifacts:
   - **Time-Trust Engine:** Calibrates device hardware clock lag against atomic NTP standards.
   - **Indian NER:** Extracts suspect names, phone numbers, and UPI VPAs from Hinglish text.
   - **CCTV ANPR:** Identifies vehicle types, persons, and license plates in video frames.
   - **Entity Resolution:** Merges fragmented phone numbers, VPAs, and IPs using Jaccard clustering.
   - **GNN Link Scoring:** Computes GraphSAGE link confidences across co-occurring entities.
   - **Spatio-Temporal Feasibility:** Computes Haversine distances to flag impossible velocity vectors (>300 km/h).
   - **Beam Search Hypotheses:** Generates competing prosecution and defense theories based on real evidentiary weight.

  ### Phase 4: Exploring Modules & Exporting BSA Court Certificates
  - Inspect the 77-node property graph in **Module 03**.
  - Track suspect movement corridors across the Leaflet map in **Module 05**.
  - Generate and print the Section 63(4) BSA compliance certificate in **Module 10**.

### Sample Evidence Files

Ready-to-use sample artifacts are provided in `EVIDENCE_SAMPLES/`:

| Sample File | Category | Verified Capability |
|-------------|----------|---------------------|
| `chat_export.txt` | Social / Mobile | Hinglish NLP Extortion & Threat Classification |
| `bank_statement.csv` | Financial Records | Statement Anomaly & Layered Transfer Detection |
| `ip_log.txt` | Network Logs | MaxMind Geolocation & AbuseIPDB Threat Scoring |

  ---

## Machine Learning Architecture & Core Features

### Authentic Indian Forensic ML Models

TraceGraph strictly rejects synthetic toy datasets in production. All 7 production models are trained exclusively on authentic Indian forensic data:

| Subsystem | Architecture | Training Dataset | Benchmark Metrics | Target Capabilities |
|-----------|--------------|------------------|-------------------|---------------------|
| **Hinglish Vernacular NLP** | Sub-word TF-IDF + Calibrated Logistic Regression | PoliWAM (3,848 real Hindi-English messages) | **77.9% Accuracy** (9 classes) | Extortion, urgency & threat intent classification |
| **UPI Mule Account Risk** | LightGBM Classifier (300 trees, 6 features) | NPCI Monthly Statistics (Apr 2019 – Dec 2024) | **0.7835 Risk Confidence** | UPI mule account probability & money trail risk |
| **Bank Statement Anomaly** | Isolation Forest + StandardScaler | AgamiAI Indian Bank Statements | **1.00 Anomaly Prob** (High Severity) | Layered transaction spikes & structuring detection |
| **PCAP Network Anomaly** | Calibrated Random Forest (100 estimators) | VIT Bhopal Cyberattack Dataset (600K packets) | **87.0% Detection Rate** | Flow-level intrusion & malicious packet detection |
| **IoT Intrusion Detector** | LightGBM Multi-class (400 trees, 105 features) | MU-IoT Manipal University (393K samples) | **16 Attack Vectors** | Sensor hijacking, CoAP/MQTT flood identification |
| **CCTV / ANPR Vision** | Ultralytics YOLOv8n + OpenCV + EasyOCR + Tesseract | Indian Traffic Feeds + Snatch 1.0 Dataset | **96.20% mAP@50** | Keyframe extraction, vehicle & plate decoding |
| **Forensic Link Scorer** | PyTorch GraphSAGE Link Scorer (`16 → 64 → 32`) | Multi-Source Indian Forensic Crime Graph | **95.58% Accuracy** | Latent suspect-to-event association scoring |

### Advanced Real-Time Forensic Features

- **Real-Time Geolocation & Telecom Prefix Resolution:** Resolves IP coordinates via MaxMind GeoLite2 databases and telecommunication circle locations across Indian telecom circles (Delhi, Mumbai, Kolkata, Chennai, Hyderabad, Bangalore, Lucknow, Ahmedabad).
- **Physical Spatio-Temporal Velocity Engine:** Evaluates spatial distance between sequential evidence points using the spherical Haversine formula against elapsed time, immediately flagging physically impossible alibis (>300 km/h).
- **Automated PCAP Packet Flow Forensics:** Automatically decodes binary `.pcap` packet streams on ingestion using `dpkt`, extracting flow lengths, TTLs, and transport ports for real-time attack vector classification.
- **Dynamic Beam Search Hypothesis Generator:** Employs beam search heuristic pruning over correlated evidence chains to generate and score competing prosecution and defense theories.
- **Automated Statement Anomaly Trigger:** Scans structured banking and UPI ledger statements dynamically on upload, passing transaction sequences through trained anomaly estimators.
- **Jaccard Multi-Modal Entity Clustering:** Discovers alias overlaps across IMEIs, MSISDNs, UPI VPAs, MACs, and IP addresses to collapse distributed criminal identities into unified clusters.
- **Cross-Case Intelligence Engine:** Computes TF-IDF vector representations and cosine similarity against cold case databases to identify cross-jurisdiction modus operandi patterns.

---

## Visual Forensic Pipelines & Architecture

### 1. Interactive Forensic Knowledge Graph (77 Nodes)

[![TraceGraph Interactive Cytoscape Graph](https://files.catbox.moe/zv8rxs.jpg)](https://files.catbox.moe/zv8rxs.jpg)
<p align="center">
  <em>Figure 3: Interactive Cytoscape Concentric Layout (77 Nodes) — Multi-Modal Entity Inspection & Radar Navigation (<a href="https://files.catbox.moe/zv8rxs.jpg">View Full Image</a>)</em>
</p>

- **Real-Time Concentric Layout:** Multi-layered rings separate primary suspects from secondary carriers, financial accounts, and IP endpoints with interactive physics forces.
- **Node Inspection Drawer:** Displays real-time carrier metadata backed by 95% GNN association confidence.
- **Radar Minimap:** Facilitates rapid navigation across massive 70+ node investigative graphs.
- **Multi-Modal Color Coding:** Direct visual differentiation for Suspects (Red), Phone/CDR (Green), Bank/UPI (Yellow), IP/Cloud (Purple), and CCTV (Pink).

### 2. Multi-Modal Network Topology & GNN Structure

[![Multi-Modal Network Topology](https://files.catbox.moe/b6x31f.png)](https://files.catbox.moe/b6x31f.png)
<p align="center">
  <em>Figure 4: Multi-Source Topological Mapping (<a href="https://files.catbox.moe/b6x31f.png">View Full Image</a>)</em>
</p>

TraceGraph maps heterogeneous crime structures into formal topological representations:
- **Topology Structuring:** Converts cellular towers (star clusters `C1N0-C1N9`), peer-to-peer money transfers (rings `C2N0-C2N9`), routing infrastructure (backbone switches `C1SW-C5SW`), and criminal collusion syndicates (dense cliques `C5N0-C5N9`) into structured entities.
- **Graph Neural Network (GNN) Link Scoring:** Employs a 2-layer **GraphSAGE** model (`16 → 64 → 32`) to compute likelihood embeddings across latent suspect-to-event relationships.
- **Neo4j Cypher Integration:** Streams nodes and edges in real-time, backed by Cytoscape.js canvas rendering.

### 3. Computer Vision & CCTV ANPR Engine

[![CCTV Surveillance & ANPR Keyframe Detection](https://files.catbox.moe/dkm3p6.jpg)](https://files.catbox.moe/dkm3p6.jpg)
<p align="center">
  <em>Figure 5: Real-World Indian Traffic Camera Keyframes — Vehicle Detection across Day, Dusk & Night Illumination (<a href="https://files.catbox.moe/dkm3p6.jpg">View Full Image</a>)</em>
</p>

The visual intelligence subsystem processes uncalibrated CCTV footage across challenging Indian lighting environments:
- **Multi-Illumination Detection:** Detects suspect vehicles across day, twilight, and severe low-light night corridors using fine-tuned **YOLOv8n**.
- **Automated License Plate Recognition (ANPR):** Performs bilateral noise filtering and Otsu adaptive thresholding before applying Tesseract OCR to extract high-security plates.
- **Camera Metadata Alignment:** Calibrates embedded camera telemetry to reconcile spatial waypoints with cellular CDR records.

### 4. Cyber-Physical & IoT Intrusion Testbed

[![IoT & Network Packet Capture Architecture](https://files.catbox.moe/udjcxi.jpg)](https://files.catbox.moe/udjcxi.jpg)
<p align="center">
  <em>Figure 6: Cyber-Physical IoT & Wireshark PCAP Capture Testbed Architecture (<a href="https://files.catbox.moe/udjcxi.jpg">View Full Image</a>)</em>
</p>

TraceGraph incorporates a comprehensive cyber-physical surveillance engine trained on real-world Indian university testbed data:
- **Physical Sensor & Edge Broker Layer:** Ingests telemetry from ESP32 microcontrollers and Raspberry Pi edge nodes communicating via MQTT, CoAP, and AMQP.
- **Network Tap & Port Mirroring:** Ingests live Wireshark PCAPs from managed switches, monitoring workstation traffic, mobile endpoints, and simulated Kali attack vectors.
- **16-Class Attack Classification:** Evaluates 105 protocol flow features using **LightGBM** to flag DoS, DDoS, brute-force, scan, and data exfiltration patterns in milliseconds.

---

## 10 Integrated Investigative Modules

TraceGraph organizes investigations into 10 sequential screens accessible via the unified module switcher:

[![TraceGraph 10 Module Forensic Console Navigation](https://files.catbox.moe/yt0430.png)](https://files.catbox.moe/yt0430.png)
<p align="center">
  <em>Figure 7: TraceGraph Unified Forensic Console Navigation Bar (<a href="https://files.catbox.moe/yt0430.png">View Full Resolution Image</a>)</em>
</p>

1. **New Case Upload (01):** Case creation form with drag-and-drop evidence ingestion and client-side SHA-256 hashing.
2. **Evidence Vault (02):** Cryptographic parent-hash chain viewer ensuring zero evidence tampering.
3. **Knowledge Graph (03):** Interactive Cytoscape graph displaying suspect-to-evidence relationships.
4. **Unified Timeline (04):** Chronological event stream with hardware RTC clock drift compensation.
5. **Geospatial Map (05):** Interactive Leaflet GPS map tracking cell tower CDRs, IP geolocations, and vehicle sightings.
6. **Spatio-Temporal Feasibility (06):** Physical road/air velocity vector validation uncovering impossible alibis.
7. **Entity Resolution (07):** Multi-modal identity clustering merging IMEIs, Phone Numbers, VPAs, and IP addresses.
8. **Cross-Case Intelligence (08):** Automated TF-IDF similarity matching against national police cold case databases.
9. **Hypothesis Builder (09):** Dynamic Beam Search scoring competing prosecution vs. defense theories with real probability scores from evidence.
10. **Court Certificate (10):** Legally admissible, print-ready evidence report under Section 63(4) BSA 2023.

## Repository Structure

```
TRACE/
├── BACKEND/             FastAPI service, evidence correlation engine & requirements.txt
├── FRONTEND/            Next.js 15 investigative console web dashboard & Cytoscape graphs
├── ML/                  7 Indian ML model notebooks & automated weight download scripts
├── docker-compose.yml   Single-command full stack container orchestration
└── README.md            Project documentation, legal compliance & setup guide
```

---

## Author

**Anubhav Sharma** ([@neurosharma05-coder](https://github.com/neurosharma05-coder))
- Creator & Lead Architect of TraceGraph

## License

This project is licensed under the [MIT License](LICENSE).
