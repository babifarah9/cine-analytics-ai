# 🎬 CineAnalytics AI - Walkthrough & Hackathon Submission Guide

**Project Name**: CineAnalytics AI  
**Devpost Hackathon**: Lights. Camera. Code. (The Blockbuster Hackathon)  
**Selected Partner Track**: **ClickHouse Track**  
**Google Cloud Technologies**: Vertex AI / Gemini 2.5 Flash, Google Agent Development Kit (ADK), Agent Platform / Cloud Run deployment setup  
**ClickHouse Integration**: ClickHouse Medallion Architecture (`box_office_mart`, `streaming_qos_mart`, `sentiment_mart`, `campaign_decisions_log`), `clickhouse-connect` client, custom SQL sandbox, and ClickHouse MCP tools  
**Repository License**: **Apache License 2.0**  

---

## 🌟 Executive Summary

**CineAnalytics AI** is an autonomous multi-agent AI Studio Director and Real-Time Telemetry Command Center for film studios and streaming media networks.

It unifies three major media & entertainment data silos into ClickHouse:
1. **Theatrical Box Office Sales**: Ticket velocity, regional gross revenue, and IMAX occupancy rates.
2. **HLS/DASH Streaming QoE**: Real-time video bitrate, buffering anomalies, and scene-by-scene viewer retention.
3. **Audience Social Sentiment**: TikTok, X/Twitter, and YouTube sentiment scores linked to specific trailer clips.

Using **Gemini 2.5 Flash** and **Google Agent Development Kit (ADK)** tool calling loops, the system inspects ClickHouse telemetry, identifies operational friction or viral opportunities, and executes autonomous studio campaign reallocations (e.g. dynamic ad spend shifts, IMAX screen reallocations, edge CDN streaming QoE upgrades).

---

## 🏗️ Architecture & Component Walkthrough

### 1. Database & ClickHouse Medallion Layer
- **Location**: [`backend/db/clickhouse_client.py`](file:///Users/bassemabifarah/Documents/cine-analytics-ai/backend/db/clickhouse_client.py)
- **Features**:
  - Raw ingest tables (`box_office_sales_raw`, `streaming_qos_raw`, `sentiment_raw`) -> Aggregated analytical views.
  - `campaign_decisions_log`: Immutable ClickHouse audit log recording every autonomous action taken by Gemini agents.
  - High-performance fallback telemetry engine when running offline or locally.

### 2. Gemini ADK Multi-Agent Fleet & Tools
- **Location**: [`backend/agents/adk_agents.py`](file:///Users/bassemabifarah/Documents/cine-analytics-ai/backend/agents/adk_agents.py) & [`backend/agents/tools/clickhouse_tools.py`](file:///Users/bassemabifarah/Documents/cine-analytics-ai/backend/agents/tools/clickhouse_tools.py)
- **Agents**:
  - `RootDirectorAgent`: Master orchestrator synthesizing telemetry and issuing executive reports.
  - `BoxOfficeAnalystAgent`: Queries theatrical ticket sales & occupancy rates.
  - `StreamingQoSAgent`: Isolates video playback bitrate drops & scene retention anomalies.
  - `SentimentAnalystAgent`: Monitors social media viral handles.
  - `MarketingOrchestratorAgent`: Executes and logs autonomous studio campaign actions.

### 3. FastAPI REST Server
- **Location**: [`backend/main.py`](file:///Users/bassemabifarah/Documents/cine-analytics-ai/backend/main.py)
- **Endpoints**:
  - `POST /api/chat`: Runs multi-step agentic workflow with real-time tool execution logs.
  - `GET /api/analytics/*`: Serves ClickHouse box office, QoE, sentiment, and decision logs.
  - `POST /api/analytics/sql`: Executes read-only ClickHouse SQL queries.
  - `POST /api/simulate`: Injects live scenario anomalies (*TikTok Surge*, *CDN Buffering Alert*, *IMAX Sellout*).

### 4. Studio Command Center Web UI
- **Location**: [`frontend/src/App.jsx`](file:///Users/bassemabifarah/Documents/cine-analytics-ai/frontend/src/App.jsx)
- **Features**:
  - **Glassmorphism Dark UI**: Built with custom HSL dark theme, glowing neon accents (`#00F2FE`, `#8A2BE2`), and responsive layout.
  - **Executive KPI Cards**: Real-time stats for Global Box Office, QoE score, Social Sentiment, and Executed Decisions.
  - **Gemini Chat Console**: Direct prompt interface with tool trajectory visibility.
  - **ClickHouse Explorer**: Tabbed view for Box Office, Streaming QoE Heatmap, Sentiment, and interactive SQL Sandbox.
  - **Simulation Engine**: One-click live event injection.

---

## 🧪 Verification & Test Results

### Evaluation Suite Run (`evals/eval_suite.py`)

Command executed:
```bash
uv run python -m evals.eval_suite
```

Result:
```
Running CineAnalytics AI Evaluation Suite...
✓ ClickHouse Box Office Tool Test Passed
✓ ClickHouse Streaming QoS Tool Test Passed
✓ ClickHouse SQL Safety Guardrail Test Passed
✓ Autonomous Campaign Logging Test Passed
✓ Agent Workflow Orchestration Test Passed
All 5/5 Evaluation & Safety Tests Passed Successfully!
```

---

## 📹 3-Minute Trailer (Demo Video Script Guide)

For your 3-minute Devpost submission video, follow this structured demo script:

| Timestamp | Screen | Voiceover / Action |
|---|---|---|
| **0:00 - 0:35** | **Executive Summary & Problem Statement** | "Welcome to CineAnalytics AI — built for Google Cloud's Agentic Cinema hackathon on the ClickHouse track. Film studios struggle to connect theatrical sales, streaming QoE, and social media sentiment." |
| **0:35 - 1:15** | **Live Telemetry & ClickHouse Explorer** | "Show the ClickHouse Explorer tabs. Show how `box_office_mart` aggregates regional ticket gross, how `streaming_qos_mart` flags Scene 3 buffering anomalies, and run a live custom query in the ClickHouse SQL Sandbox." |
| **1:15 - 2:15** | **Gemini ADK Agent in Action** | "Prompt Gemini Executive AI Director: *'Analyze opening weekend box office and streaming QoE for Galactic Odyssey 2'*. Show Gemini querying ClickHouse tools step-by-step, detecting Scene 3 bitrate drop & TikTok viral spike, and autonomously logging a $350k campaign reallocation." |
| **2:15 - 3:00** | **Simulation Engine & ClickHouse Audit Log** | "Click *'Simulate Viral TikTok Spike'* or *'Simulate Edge CDN Congestion'*. Show the real-time update in the ClickHouse Autonomous Decision Audit Log and conclude!" |

---

## 📋 Devpost Submission Checklist

- [x] **Hosted Project Code**: Open source on GitHub/GitLab with complete source code and runnable instructions.
- [x] **Open Source License**: Apache License 2.0 visible at root ([`LICENSE`](file:///Users/bassemabifarah/Documents/cine-analytics-ai/LICENSE)).
- [x] **Runtime Use of GCP & Partner**: `google-genai` and `clickhouse-connect` imported & invoked in Python codebase.
- [x] **Partner Track Selection**: ClickHouse Track.
- [ ] **3-Minute Demo Video**: Recorded according to script above and uploaded to YouTube/Vimeo.
- [ ] **Hosted URL**: Deployed app link added to Devpost form.
