import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ExecutiveSummary from './components/ExecutiveSummary';
import AgentChatConsole from './components/AgentChatConsole';
import ClickHouseExplorer from './components/ClickHouseExplorer';
import SimulationControls from './components/SimulationControls';

export default function App() {
  const [selectedFilm, setSelectedFilm] = useState('Galactic Odyssey 2');
  const [boxOfficeData, setBoxOfficeData] = useState([]);
  const [qosData, setQosData] = useState([]);
  const [sentimentData, setSentimentData] = useState([]);
  const [decisions, setDecisions] = useState([]);
  const [clickhouseConnected, setClickhouseConnected] = useState(false);

  const fetchAnalytics = async () => {
    try {
      // Health check
      const hRes = await fetch('/api/health');
      const hData = await hRes.json();
      setClickhouseConnected(hData.clickhouse_connected);

      // Box Office
      const boRes = await fetch(`/api/analytics/box-office?film_id=${encodeURIComponent(selectedFilm)}`);
      const boData = await boRes.json();
      setBoxOfficeData(boData.data || []);

      // QoS
      const qosRes = await fetch(`/api/analytics/qos?film_id=${encodeURIComponent(selectedFilm)}`);
      const qosDataRes = await qosRes.json();
      setQosData(qosDataRes.data || []);

      // Sentiment
      const sentRes = await fetch(`/api/analytics/sentiment?film_id=${encodeURIComponent(selectedFilm)}`);
      const sentDataRes = await sentRes.json();
      setSentimentData(sentDataRes.data || []);

      // Decisions Log
      const decRes = await fetch('/api/analytics/decisions');
      const decDataRes = await decRes.json();
      setDecisions(decDataRes.decisions || []);
    } catch (err) {
      console.warn('API server offline. Activating embedded demo telemetry:', err.message);
      setClickhouseConnected(false);
      setBoxOfficeData([
        { region: "North America (LA/NY)", total_tickets: 482000, total_gross: 7230000, occupancy_rate: 92.5, opening_weekend_projection: "$145.5M" },
        { region: "Europe (London/Paris)", total_tickets: 310000, total_gross: 4650000, occupancy_rate: 84.1, opening_weekend_projection: "$88.0M" },
        { region: "Asia-Pacific (Tokyo/Seoul)", total_tickets: 290000, total_gross: 3480000, occupancy_rate: 78.4, opening_weekend_projection: "$62.0M" },
      ]);
      setQosData([
        { scene_id: 1, scene_name: "Opening Battle Scene", avg_bitrate: 8500, total_buffering_events: 12, retention_pct: 98.5 },
        { scene_id: 2, scene_name: "Space Station Chase", avg_bitrate: 8200, total_buffering_events: 18, retention_pct: 96.2 },
        { scene_id: 3, scene_name: "Asteroid Belt Confrontation", avg_bitrate: 4200, total_buffering_events: 142, retention_pct: 74.1 },
        { scene_id: 4, scene_name: "Climactic Duel & Conclusion", avg_bitrate: 8600, total_buffering_events: 15, retention_pct: 92.8 }
      ]);
      setSentimentData([
        { platform: "TikTok", avg_sentiment: 0.88, mentions: 142000, viral_hook: "#GalacticScene3VFX" },
        { platform: "X / Twitter", avg_sentiment: 0.76, mentions: 98000, viral_hook: "Climax plot twist" },
        { platform: "YouTube Cinema", avg_sentiment: 0.92, mentions: 65000, viral_hook: "Dolby Atmos audio mix" },
        { platform: "Reddit /r/movies", avg_sentiment: 0.81, mentions: 41000, viral_hook: "Director's Cut rumors" }
      ]);
      setDecisions([
        { decision_type: "THEATER_SCREEN_REALLOCATION", target_film: "Galactic Odyssey 2", allocated_budget: 250000, rationale: "Shifted 45 IMAX screens due to 92.5% occupancy rate demand in opening weekend projection.", timestamp: "2026-08-22 00:24:00" },
        { decision_type: "MARKETING_CAMPAIGN_BOOST", target_film: "Galactic Odyssey 2", allocated_budget: 150000, rationale: "Scene 3 clip reached 0.88 sentiment score and 142k mentions on TikTok.", timestamp: "2026-08-22 00:25:00" }
      ]);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 5000);
    return () => clearInterval(interval);
  }, [selectedFilm]);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '40px' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Top Navbar */}
        <Navbar
          selectedFilm={selectedFilm}
          setSelectedFilm={setSelectedFilm}
          clickhouseConnected={clickhouseConnected}
        />

        {/* Live Executive KPI Banner */}
        <ExecutiveSummary
          filmTitle={selectedFilm}
          boxOfficeData={boxOfficeData}
          qosData={qosData}
          sentimentData={sentimentData}
          decisionsCount={decisions.length}
        />

        {/* Core Dual Column Workspace */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '24px' }}>
          
          {/* Column 1: Gemini Agent Chat Console */}
          <AgentChatConsole
            filmTitle={selectedFilm}
            onDecisionLogged={fetchAnalytics}
          />

          {/* Column 2: ClickHouse Real-Time Analytics Explorer */}
          <ClickHouseExplorer
            filmTitle={selectedFilm}
            boxOfficeData={boxOfficeData}
            qosData={qosData}
            sentimentData={sentimentData}
          />

        </div>

        {/* Bottom Real-World Scenario Simulation Engine */}
        <SimulationControls
          filmTitle={selectedFilm}
          onSimulationTriggered={fetchAnalytics}
          decisions={decisions}
        />

        {/* Footer */}
        <footer style={{ marginTop: '40px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-dim)', paddingTop: '20px', borderTop: '1px solid var(--border-glass)' }}>
          <p>
            🎬 <strong>CineAnalytics AI</strong> | Google Cloud Agentic Cinema Blockbuster Hackathon Submission (ClickHouse Track)
          </p>
          <p style={{ marginTop: '4px' }}>
            Built with <strong>Gemini 2.5 Flash</strong>, <strong>Google Agent Development Kit (ADK)</strong>, <strong>ClickHouse MCP/SQL</strong>, and <strong>React</strong>. Open Source under Apache 2.0.
          </p>
        </footer>

      </div>
    </div>
  );
}
