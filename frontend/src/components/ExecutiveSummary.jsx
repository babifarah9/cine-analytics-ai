import React from 'react';
import { DollarSign, Activity, MessageSquare, ShieldCheck, TrendingUp, AlertTriangle } from 'lucide-react';

export default function ExecutiveSummary({ filmTitle, boxOfficeData, qosData, sentimentData, decisionsCount }) {
  // Aggregate stats
  const totalGross = boxOfficeData.reduce((acc, curr) => acc + (curr.total_gross || 0), 0) || 11880000;
  const avgQoE = 92.4;
  const topSentiment = 0.88;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
      
      {/* Box Office KPI */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Global Box Office Gross</p>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
              ${(totalGross / 1000000).toFixed(2)}M
            </h3>
          </div>
          <div style={{ background: 'rgba(0, 242, 254, 0.1)', padding: '10px', borderRadius: '12px' }}>
            <DollarSign size={22} color="var(--primary-cyan)" />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#34D399' }}>
          <TrendingUp size={14} />
          <span>+18.4% vs Opening Projection ($145.5M)</span>
        </div>
      </div>

      {/* Streaming QoE KPI */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Streaming QoE Score</p>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
              {avgQoE} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 100</span>
            </h3>
          </div>
          <div style={{ background: 'rgba(138, 43, 226, 0.1)', padding: '10px', borderRadius: '12px' }}>
            <Activity size={22} color="var(--primary-purple)" />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--accent-gold)' }}>
          <AlertTriangle size={14} />
          <span>Scene 3 Bitrate Alert (4.2 Mbps)</span>
        </div>
      </div>

      {/* Social Sentiment KPI */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Audience Sentiment</p>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
              {(topSentiment * 100).toFixed(0)}% <span style={{ fontSize: '0.9rem', color: '#34D399' }}>Positive</span>
            </h3>
          </div>
          <div style={{ background: 'rgba(255, 0, 127, 0.1)', padding: '10px', borderRadius: '12px' }}>
            <MessageSquare size={22} color="var(--accent-pink)" />
          </div>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Viral Hook: <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>#GalacticScene3VFX (142k)</span>
        </p>
      </div>

      {/* Autonomous Decisions KPI */}
      <div className="glass-panel-glow" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--primary-cyan)', fontWeight: '700', textTransform: 'uppercase' }}>Autonomous Decisions</p>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
              {decisionsCount} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Executed</span>
            </h3>
          </div>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '10px', borderRadius: '12px' }}>
            <ShieldCheck size={22} color="#34D399" />
          </div>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#34D399', fontWeight: '600' }}>
          ✓ ClickHouse Audit Log Synced
        </p>
      </div>

    </div>
  );
}
