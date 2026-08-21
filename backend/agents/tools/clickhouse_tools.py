import json
from backend.db.clickhouse_client import ch_client


def get_box_office_analytics(film_id: str = '') -> str:
  """Queries real-time box office ticket sales, gross revenue, occupancy rate,

  and regional performance metrics from ClickHouse.

  Args:
      film_id: Optional target film ID or title filter.
  """
  records = ch_client.query_box_office(film_id)
  return json.dumps({
      'status': 'SUCCESS',
      'source': 'ClickHouse.box_office_mart',
      'records_count': len(records),
      'data': records,
  })


def get_streaming_qos_telemetry(film_id: str = '') -> str:
  """Queries video streaming Quality of Experience (QoE) metrics from

  ClickHouse,

  including bitrate, buffering events, and scene-by-scene viewer retention.

  Args:
      film_id: Optional target film ID or title filter.
  """
  records = ch_client.query_streaming_qos(film_id)
  return json.dumps({
      'status': 'SUCCESS',
      'source': 'ClickHouse.streaming_qos_mart',
      'records_count': len(records),
      'data': records,
  })


def get_social_sentiment_analytics(film_id: str = '') -> str:
  """Queries real-time social media sentiment, platform reactions, and viral

  scene hooks from ClickHouse.

  Args:
      film_id: Optional target film ID or title filter.
  """
  records = ch_client.query_sentiment(film_id)
  return json.dumps({
      'status': 'SUCCESS',
      'source': 'ClickHouse.sentiment_mart',
      'records_count': len(records),
      'data': records,
  })


def execute_clickhouse_sql(sql_query: str) -> str:
  """Executes a custom read-only SQL query directly against the ClickHouse

  analytics database.

  Args:
      sql_query: A valid SELECT SQL query against ClickHouse tables.
  """
  try:
    res = ch_client.execute_raw_sql(sql_query)
    return json.dumps({
        'status': 'SUCCESS',
        'query': sql_query,
        'source': 'ClickHouse.DirectSQL',
        'data': res,
    })
  except Exception as e:
    return json.dumps({
        'status': 'ERROR',
        'message': str(e),
        'query': sql_query,
    })


def execute_studio_campaign_decision(
    decision_type: str,
    target_film: str,
    allocated_budget: float,
    target_region: str,
    rationale: str,
) -> str:
  """Triggers and logs an autonomous studio campaign decision (e.g. ad budget

  shift,

  IMAX screen allocation, or CDN video optimization) to ClickHouse.

  Args:
      decision_type: Type of decision (e.g. THEATER_SCREEN_REALLOCATION,
        MARKETING_CAMPAIGN_BOOST, CDN_QOS_OPTIMIZATION).
      target_film: The movie title being modified.
      allocated_budget: Dollar amount allocated or shifted.
      target_region: Target geographic region or ad platform.
      rationale: Executive reasoning based on ClickHouse telemetry.
  """
  decision_record = ch_client.log_decision(
      decision_type=decision_type,
      target_film=target_film,
      allocated_budget=allocated_budget,
      target_region=target_region,
      rationale=rationale,
  )
  return json.dumps({
      'status': 'ACTION_EXECUTED_AND_LOGGED',
      'source': 'ClickHouse.campaign_decisions_log',
      'decision': decision_record,
  })
