"""Evaluation Suite for CineAnalytics AI (Gemini + ClickHouse Multi-Agent System).

Validates tool trajectory accuracy, ClickHouse SQL safety compliance, and
decision quality.
"""

import json
import pytest
from backend.agents.adk_agents import agent_orchestrator
from backend.agents.tools.clickhouse_tools import (
    execute_clickhouse_sql,
    execute_studio_campaign_decision,
    get_box_office_analytics,
    get_streaming_qos_telemetry,
)
from backend.db.clickhouse_client import ch_client


def test_clickhouse_box_office_tool():
  """Verifies that Box Office tool returns valid structured JSON with ClickHouse metrics."""
  res_str = get_box_office_analytics("Galactic Odyssey 2")
  data = json.loads(res_str)
  assert data["status"] == "SUCCESS"
  assert "ClickHouse" in data["source"]
  assert len(data["data"]) > 0
  first = data["data"][0]
  assert "film_title" in first
  assert "total_gross" in first


def test_clickhouse_streaming_qos_tool():
  """Verifies that HLS/DASH Streaming QoS tool correctly isolates scene retention anomalies."""
  res_str = get_streaming_qos_telemetry("Galactic Odyssey 2")
  data = json.loads(res_str)
  assert data["status"] == "SUCCESS"
  data_list = data["data"]
  assert len(data_list) > 0
  # Check for scene 3 anomaly detection
  scene_3 = next((s for s in data_list if s.get("scene_id") == 3), None)
  assert scene_3 is not None
  assert scene_3["total_buffering_events"] > 100


def test_sql_safety_guardrail():
  """Ensures non-SELECT queries are blocked for database security compliance."""
  with pytest.raises(
      ValueError, match="Only SELECT queries are allowed for safety compliance."
  ):
    ch_client.execute_raw_sql("DROP TABLE cine_analytics.box_office_sales_raw")


def test_autonomous_campaign_logging():
  """Verifies logging of autonomous campaign decisions to ClickHouse log."""
  res_str = execute_studio_campaign_decision(
      decision_type="TEST_EVAL_DECISION",
      target_film="Galactic Odyssey 2",
      allocated_budget=100000.0,
      target_region="Global",
      rationale="Eval suite validation run.",
  )
  data = json.loads(res_str)
  assert data["status"] == "ACTION_EXECUTED_AND_LOGGED"
  assert data["decision"]["allocated_budget"] == 100000.0


def test_agent_workflow_orchestration():
  """Runs end-to-end agent workflow smoke test."""
  res = agent_orchestrator.run_agent_workflow(
      "Analyze opening weekend box office and check streaming QoE for Galactic"
      " Odyssey 2"
  )
  assert res["status"] == "SUCCESS"
  assert len(res["agent_trajectory"]) >= 3
  assert "Galactic Odyssey 2" in res["final_response"]


if __name__ == "__main__":
  print("Running CineAnalytics AI Evaluation Suite...")
  test_clickhouse_box_office_tool()
  test_clickhouse_streaming_qos_tool()
  test_sql_safety_guardrail()
  test_autonomous_campaign_logging()
  test_agent_workflow_orchestration()
  print("All 5/5 Evaluation & Safety Tests Passed Successfully!")
