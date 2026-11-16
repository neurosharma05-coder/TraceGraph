// TraceGraph Knowledge Graph Cypher Script
MERGE (s1:Suspect {id: 'S001', name: 'Vikram Malhotra', role: 'Kingpin'})
MERGE (s2:Suspect {id: 'S002', name: 'Reena Kapoor', role: 'Mule Coordinator'})
MERGE (s3:Suspect {id: 'S003', name: 'Raju Verma', role: 'Cash Courier'})

MERGE (d1:Device {imei: '358240051111110', model: 'OnePlus 11'})
MERGE (d2:Device {imei: '490154203237518', model: 'Samsung Galaxy A14'})

MERGE (a1:Account {number: 'ACC-1001', bank: 'SBI', balance: 45000})
MERGE (a2:Account {number: 'ACC-2001', bank: 'HDFC', balance: 12000})
MERGE (a3:Account {number: 'ACC-3001', bank: 'Kotak', balance: 5000})

MERGE (s1)-[:OPERATES {confidence: 0.97}]->(d1)
MERGE (s2)-[:OPERATES {confidence: 0.94}]->(d2)
MERGE (s1)-[:CONTROLS]->(a1)
MERGE (s2)-[:CONTROLS]->(a2)
MERGE (a1)-[:TRANSFERS_TO {amount: 847000, ts: '2026-02-14T09:15:30Z'}]->(a2)
MERGE (a2)-[:TRANSFERS_TO {amount: 820000, ts: '2026-02-14T11:30:00Z'}]->(a3)
