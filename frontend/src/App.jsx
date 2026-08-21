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
      console.error('Error fetching telemetry:', err);
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
