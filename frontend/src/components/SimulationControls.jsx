import React, { useState } from 'react';
import { Radio, Zap, AlertTriangle, TrendingUp, History, ShieldCheck } from 'lucide-react';

export default function SimulationControls({ filmTitle, onSimulationTriggered, decisions }) {
  const [loading, setLoading] = useState(false);
  const [activeSimulation, setActiveSimulation] = useState(null);

  const triggerSimulation = async (eventType) => {
    setLoading(true);
    setActiveSimulation(eventType);
    try {
      await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_type: eventType, film_id: filmTitle })
      });
      if (onSimulationTriggered) onSimulationTriggered();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginTop: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Radio size={20} color="var(--accent-pink)" className="pulse" />
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: '700' }}>
            Live Real-World Scenario Simulation Engine
          </h3>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Inject live telemetry anomalies into ClickHouse datastores
        </span>
      </div>

      {/* Simulation Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        
        {/* TikTok Viral Spike */}
        <button
          onClick={() => triggerSimulation('VIRAL_TIKTOK_BOOST')}
          disabled={loading}
          className="glass-panel"
          style={{
            padding: '16px',
            textAlign: 'left',
            cursor: 'pointer',
            border: activeSimulation === 'VIRAL_TIKTOK_BOOST' ? '1px solid var(--accent-pink)' : '1px solid var(--border-glass)',
            background: 'rgba(255, 0, 127, 0.06)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <Zap size={18} color="var(--accent-pink)" />
            <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>Simulate Viral TikTok Spike</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Triggers +250k social mentions. Gemini automatically reallocates $200k ad budget to viral channels.
          </p>
        </button>

        {/* CDN Buffering Congestion */}
        <button
          onClick={() => triggerSimulation('BUFFERING_SPIKE')}
          disabled={loading}
          className="glass-panel"
          style={{
            padding: '16px',
            textAlign: 'left',
            cursor: 'pointer',
            border: activeSimulation === 'BUFFERING_SPIKE' ? '1px solid var(--accent-gold)' : '1px solid var(--border-glass)',
            background: 'rgba(255, 215, 0, 0.06)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <AlertTriangle size={18} color="var(--accent-gold)" />
            <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>Simulate Edge CDN Congestion</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Injects 140+ buffering events in Scene 3. Gemini automatically re-routes stream bandwidth to edge servers.
          </p>
        </button>

        {/* IMAX Sold Out Surge */}
        <button
          onClick={() => triggerSimulation('IMAX_SURGE')}
          disabled={loading}
          className="glass-panel"
          style={{
            padding: '16px',
            textAlign: 'left',
            cursor: 'pointer',
            border: activeSimulation === 'IMAX_SURGE' ? '1px solid var(--primary-cyan)' : '1px solid var(--border-glass)',
            background: 'rgba(0, 242, 254, 0.06)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <TrendingUp size={18} color="var(--primary-cyan)" />
            <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>Simulate IMAX Sold-Out Surge</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Pushes theatrical occupancy to 98%. Gemini logs 60 additional late-night IMAX showtime expansions.
          </p>
        </button>

      </div>

      {/* Decision Audit Log Feed */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <History size={16} color="var(--text-muted)" />
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
            ClickHouse Autonomous Decision Audit Log
          </h4>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
          {decisions.map((dec, idx) => (
            <div key={idx} style={{ background: 'rgba(15,23,42,0.5)', border: '1px solid var(--border-glass)', borderRadius: '10px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={14} color="#34D399" />
                  <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--primary-cyan)' }}>{dec.decision_type}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({dec.target_film})</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {dec.rationale}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: 'var(--accent-gold)', fontWeight: '700', fontSize: '0.85rem' }}>
                  ${(dec.allocated_budget || 0).toLocaleString()}
                </span>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                  {dec.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
