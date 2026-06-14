# GridMind AI – Agentic Power Grid Digital Twin

## Far Away Hackathon 2026 Submission

GridMind AI is an Agentic AI-powered Digital Twin platform for power grid monitoring, predictive maintenance, and autonomous decision support.

The system combines real-time electricity data, AI analytics, digital twin simulation, and predictive maintenance algorithms to provide intelligent grid monitoring and early failure detection.

---

# Problem Statement

Modern power grids face several critical challenges:

- Unexpected equipment failures
- High maintenance costs
- Renewable energy fluctuations
- Delayed fault detection
- Grid instability and overloads
- Lack of intelligent decision support

Most systems are reactive and respond after failures occur.

---

# Solution

GridMind AI transforms traditional monitoring into an intelligent, predictive system by combining:

- Real-time grid data acquisition
- AI-powered predictive maintenance
- Digital twin simulation
- Autonomous alert generation
- Risk assessment and recommendations
- Renewable energy analysis

The platform predicts issues before failures occur and recommends corrective actions.

---

# Key Features

## Real-Time Grid Monitoring

- Grid demand tracking
- Power generation tracking
- Grid frequency monitoring
- Carbon intensity analysis
- Renewable energy percentage tracking

## Predictive Maintenance Engine

- Health score calculation
- Failure probability prediction
- Thermal risk analysis
- Root cause detection
- Maintenance recommendations

## Digital Twin Simulation

- Virtual power grid representation
- Stress analysis
- Scenario simulation
- Failure impact modeling

## Agentic AI Layer

- Autonomous monitoring
- Intelligent alerts
- Risk categorization
- Recommendation generation

## Data Logging

- Historical analysis storage
- Grid data logging
- Performance tracking

---

# System Architecture

```
Electricity Maps API
        │
        ▼
API Connector Layer
        │
        ▼
Real-Time Grid Data
        │
        ▼
Physics & Analytics Engine
        │
        ▼
Predictive Maintenance Engine
        │
        ▼
Agentic Decision Layer
        │
        ▼
Digital Twin Dashboard
```

---

# Technology Stack

## Backend

- Python 3
- Flask

## Frontend

- HTML5
- CSS3
- JavaScript

## Data Source

- Electricity Maps API

## Storage

- Pandas
- OpenPyXL
- Excel Logging

## Version Control

- Git
- GitHub

---

# Project Structure

```
AgenticAI-Power-Grid/

│
├── app.py
├── api_connector.py
├── physics_engine.py
├── data_logger.py
│
├── static/
│   ├── app.js
│   └── style.css
│
├── templates/
│   └── index.html
│
├── grid_analysis_log.xlsx
├── grid_raw_data.xlsx
│
└── README.md
```

---

# Installation Guide

## Step 1 – Clone Repository

```bash
git clone https://github.com/Dhruvin-sys/AgenticAI-Power-Grid.git
```

## Step 2 – Enter Project Directory

```bash
cd AgenticAI-Power-Grid
```

## Step 3 – Create Virtual Environment (Recommended)

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### Linux / Mac

```bash
python3 -m venv venv
source venv/bin/activate
```

---

## Step 4 – Install Required Libraries

```bash
pip install flask
pip install requests
pip install pandas
pip install openpyxl
```

Or install all together:

```bash
pip install flask requests pandas openpyxl
```

---

## Step 5 – Configure API Key

Open:

```text
api_connector.py
```

Replace:

```python
API_KEY = "YOUR_API_KEY"
```

with your Electricity Maps API key.

---

## Step 6 – Run Application

```bash
python app.py
```

---

## Step 7 – Open Dashboard

Open your browser and navigate to:

```text
http://127.0.0.1:5000
```

The GridMind AI dashboard should now be running.

---

# Dashboard Outputs

The platform generates:

- Demand Analysis
- Generation Analysis
- Carbon Intensity Monitoring
- Renewable Energy Monitoring
- Health Score
- Failure Probability
- Grid Utilization
- Thermal Risk Detection
- Predictive Alerts
- AI Recommendations

---

# Example Metrics

The dashboard analyzes:

| Parameter | Description |
|------------|------------|
| Demand | Current grid load |
| Generation | Current power generation |
| Frequency | Grid operating frequency |
| Carbon Intensity | CO₂ emissions indicator |
| Renewable Percentage | Renewable contribution |
| Health Score | Overall grid condition |
| Failure Probability | Predicted risk |
| Thermal Risk | Overheating assessment |
| Supply Margin | Demand-generation buffer |

---

# Future Scope

## Phase 2

- IoT Sensor Integration
- Smart Meter Integration
- Edge Computing

## Phase 3

- Reinforcement Learning
- Autonomous Grid Optimization
- Self-Healing Grid Mechanisms

## Phase 4

- Utility Scale Deployment
- Smart City Integration
- National Grid Digital Twin

---

# Hackathon MVP Status

### Completed

✅ Live Dashboard

✅ Electricity Maps API Integration

✅ Agentic AI Monitoring

✅ Predictive Maintenance Engine

✅ Digital Twin Analytics

✅ Alert Generation

✅ Data Logging

✅ Renewable Energy Tracking

✅ Carbon Intensity Tracking

---

# Team

CODe77

Far Away Hackathon 2026

---

# Repository

https://github.com/Dhruvin-sys/AgenticAI-Power-Grid
