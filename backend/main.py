from typing import Any, Dict, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.agents.adk_agents import agent_orchestrator
from backend.db.clickhouse_client import ch_client
from backend.db.seed_data import seed_database

app = FastAPI(
    title="CineAnalytics AI API",
    description=(
        "Autonomous Multi-Agent AI Director & Real-Time Cinema Analytics Engine"
        " powered by Gemini & ClickHouse"
    ),
    version="1.0.0",
)

# Enable CORS for frontend Vite dev server & production builds
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_db_seed():
  seed_database()


class ChatRequest(BaseModel):
  prompt: str


class SQLRequest(BaseModel):
  sql_query: str


class SimulationRequest(BaseModel):
  event_type: str  # e.g. "VIRAL_TIKTOK_BOOST", "BUFFERING_SPIKE", "IMAX_SURGE"
  film_id: Optional[str] = "Galactic Odyssey 2"


@app.get("/")
def root():
  return {
      "app": "CineAnalytics AI",
      "status": "ONLINE",
      "hackathon_track": "ClickHouse Track",
      "model": "Gemini 2.5 Flash",
      "docs_url": "/docs",
  }


@app.get("/api/health")
def health():
  return {
      "status": "HEALTHY",
      "clickhouse_connected": ch_client._is_connected,
      "gemini_orchestrator": "READY",
  }


@app.post("/api/chat")
def run_chat_workflow(req: ChatRequest):
  if not req.prompt:
    raise HTTPException(status_code=400, detail="Prompt must not be empty.")
  res = agent_orchestrator.run_agent_workflow(req.prompt)
  return res


@app.get("/api/analytics/box-office")
def get_box_office(film_id: Optional[str] = None):
  return {"data": ch_client.query_box_office(film_id)}


@app.get("/api/analytics/qos")
def get_qos(film_id: Optional[str] = None):
  return {"data": ch_client.query_streaming_qos(film_id)}


@app.get("/api/analytics/sentiment")
def get_sentiment(film_id: Optional[str] = None):
  return {"data": ch_client.query_sentiment(film_id)}


@app.get("/api/analytics/decisions")
def get_decisions():
  return {"decisions": ch_client.get_recent_decisions()}


@app.post("/api/analytics/sql")
def execute_sql(req: SQLRequest):
  try:
    data = ch_client.execute_raw_sql(req.sql_query)
    return {"status": "SUCCESS", "data": data}
  except Exception as e:
    raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/simulate")
def simulate_event(req: SimulationRequest):
  if req.event_type == "VIRAL_TIKTOK_BOOST":
    ch_client.log_decision(
        decision_type="VIRAL_TIKTOK_SPIKE_SIMULATED",
        target_film=req.film_id,
        allocated_budget=200000.0,
        target_region="TikTok / Shorts",
        rationale=(
            "Simulated viral trailer spike: Sentiment increased to 0.95 with"
            " +250k mentions."
        ),
    )
    msg = "Simulated Viral TikTok Surge (+250k mentions)."
  elif req.event_type == "BUFFERING_SPIKE":
    ch_client.log_decision(
        decision_type="CDN_BUFFERING_ALERT_SIMULATED",
        target_film=req.film_id,
        allocated_budget=50000.0,
        target_region="US-West Edge CDN",
        rationale=(
            "Simulated CDN congestion event: Upgraded edge buffer pool to"
            " prevent stream drop-offs."
        ),
    )
    msg = "Simulated CDN Buffering Congestion Alert."
  elif req.event_type == "IMAX_SURGE":
    ch_client.log_decision(
        decision_type="IMAX_THEATER_EXPANSION_SIMULATED",
        target_film=req.film_id,
        allocated_budget=180000.0,
        target_region="North America IMAX",
        rationale=(
            "Simulated theatrical sellout: Added 60 late-night IMAX showtimes."
        ),
    )
    msg = "Simulated IMAX Sold Out Surge (+60 showtimes)."
  else:
    msg = "Simulated generic telemetry update."

  return {
      "status": "SIMULATION_TRIGGERED",
      "event": req.event_type,
      "message": msg,
      "decisions": ch_client.get_recent_decisions(),
  }


if __name__ == "__main__":
  import uvicorn

  uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
