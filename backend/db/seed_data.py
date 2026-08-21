"""Database Seeder for ClickHouse CineAnalytics Telemetry."""

from backend.db.clickhouse_client import ch_client


def seed_database():
  print("Seeding ClickHouse Medallion Telemetry Datastores...")
  ch_client.initialize_schema()
  print("Pre-loading ClickHouse Real-Time Telemetry Marts...")

  # Log initial autonomous baseline decisions
  ch_client.log_decision(
      decision_type="THEATER_SCREEN_REALLOCATION",
      target_film="Galactic Odyssey 2",
      allocated_budget=250000.0,
      target_region="North America (LA IMAX)",
      rationale=(
          "Shifted 45 IMAX screens from low-performing slots due to 92.5%"
          " occupancy rate demand in opening weekend projection."
      ),
  )

  ch_client.log_decision(
      decision_type="MARKETING_CAMPAIGN_BOOST",
      target_film="Galactic Odyssey 2",
      allocated_budget=150000.0,
      target_region="TikTok / Viral Reels",
      rationale=(
          "Scene 3 clip reached 0.88 sentiment score and 142k mentions."
          " Doubled social spend to amplify viral momentum."
      ),
  )

  print("Database seeding completed successfully.")


if __name__ == "__main__":
  seed_database()
