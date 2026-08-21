import React from 'react';
import { Film, Database, Cloud, Activity, Sparkles } from 'lucide-react';

export default function Navbar({ selectedFilm, setSelectedFilm, clickhouseConnected }) {
  return (
    <header className="glass-panel" style={{ borderRadius: '0 0 16px 16px', marginBottom: '24px', padding: '16px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #00F2FE 0%, #8A2BE2 100%)',
            padding: '10px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)'
          }}>
            <Film size={26} color="#000" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
                CineAnalytics <span className="gradient-text-cyan">AI</span>
              </h1>
              <span className="badge-live">LIVE STUDIO TELEMETRY</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Google Cloud Agent Platform & ClickHouse Enterprise Integration
            </p>
          </div>
        </div>

        {/* Film Selector & System Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          
          {/* Film Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.05)', padding: '6px 14px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
            <Sparkles size={16} color="var(--accent-gold)" />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Selected Title:</span>
            <select
              value={selectedFilm}
              onChange={(e) => setSelectedFilm(e.target.value)}
              style={{
                background: 'transparent',
                color: 'var(--text-main)',
                border: 'none',
                fontFamily: 'var(--font-heading)',
                fontWeight: '700',
                fontSize: '0.9rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="Galactic Odyssey 2" style={{ background: '#0F172A' }}>Galactic Odyssey 2 (2026)</option>
              <option value="Cyberpunk RED" style={{ background: '#0F172A' }}>Cyberpunk RED</option>
              <option value="The Quantum Heist" style={{ background: '#0F172A' }}>The Quantum Heist</option>
            </select>
          </div>

          {/* Status Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <Cloud size={16} color="#00F2FE" />
              <span>Gemini 2.5 Flash</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: clickhouseConnected ? '#34D399' : '#FBBF24' }}>
              <Database size={16} />
              <span>ClickHouse {clickhouseConnected ? 'Connected' : 'Simulation Engine'}</span>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}
