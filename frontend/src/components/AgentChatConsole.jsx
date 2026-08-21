import React, { useState } from 'react';
import { Bot, Send, Sparkles, Terminal, CheckCircle2, ChevronRight, Cpu } from 'lucide-react';

export default function AgentChatConsole({ filmTitle, onDecisionLogged }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: `Hello Director! I am **CineAnalytics AI**, powered by **Gemini 2.5 Flash** & **ClickHouse**. I am monitoring live box office sales, streaming QoE metrics, and audience social sentiment for **${filmTitle}**.\n\nHow can I optimize our studio production & campaign today?`,
      trajectory: []
    }
  ]);

  const quickPrompts = [
    `Analyze Box Office & Streaming QoE for ${filmTitle}`,
    `Run ClickHouse SQL for Regional Occupancy Rates`,
    `Diagnose Scene 3 Retention Anomaly & Boost TikTok Ads`
  ];

  const handleSend = async (customPrompt) => {
    const query = customPrompt || prompt;
    if (!query.trim() || loading) return;

    setPrompt('');
    setLoading(true);

    // Add User Message
    const userMsg = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query })
      });
      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: data.final_response,
          trajectory: data.agent_trajectory || [],
          model: data.model_used
        }
      ]);

      if (onDecisionLogged) onDecisionLogged();
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: `⚠️ **Error communicating with Gemini Orchestrator**: ${err.message}`,
          trajectory: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '620px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border-glass)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'rgba(0, 242, 254, 0.15)', padding: '8px', borderRadius: '10px' }}>
            <Bot size={20} color="var(--primary-cyan)" />
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: '700' }}>
              Gemini Executive AI Director Console
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Autonomous Multi-Agent Fleet with ClickHouse Tool Binding
            </p>
          </div>
        </div>
        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', background: 'rgba(138, 43, 226, 0.15)', color: '#D8B4FE', padding: '4px 10px', borderRadius: '6px' }}>
          gemini-2.5-flash
        </span>
      </div>

      {/* Messages Scroll Container */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: msg.sender === 'user' ? '80%' : '92%',
              background: msg.sender === 'user' ? 'linear-gradient(135deg, rgba(0,242,254,0.2) 0%, rgba(0,114,255,0.2) 100%)' : 'rgba(15, 23, 42, 0.6)',
              border: msg.sender === 'user' ? '1px solid rgba(0,242,254,0.4)' : '1px solid var(--border-glass)',
              borderRadius: '14px',
              padding: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}
          >
            {/* Trajectory Step Log if assistant */}
            {msg.trajectory && msg.trajectory.length > 0 && (
              <div style={{ marginBottom: '14px', background: 'rgba(0,0,0,0.4)', borderRadius: '10px', padding: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--primary-cyan)', fontWeight: '700', marginBottom: '8px' }}>
                  <Terminal size={14} />
                  <span>ClickHouse Multi-Agent Execution Trajectory:</span>
                </div>
                {msg.trajectory.map((step, sIdx) => (
                  <div key={sIdx} style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '6px', paddingLeft: '8px', borderLeft: '2px solid var(--primary-purple)' }}>
                    <span style={{ color: '#FDBA74', fontWeight: '600' }}>[{step.agent}]</span> Tool Call: <span style={{ color: '#38BDF8' }}>{step.tool}</span>({JSON.stringify(step.args)})
                    {step.status === 'COMPLETED' && <span style={{ color: '#34D399', marginLeft: '6px' }}>✓ ClickHouse Executed</span>}
                  </div>
                ))}
              </div>
            )}

            {/* Content text */}
            <div style={{ fontSize: '0.9rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ alignSelf: 'flex-start', background: 'rgba(15,23,42,0.6)', border: '1px solid var(--border-glow)', borderRadius: '14px', padding: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Cpu size={18} className="spin" color="var(--primary-cyan)" />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Gemini 2.5 Flash is querying ClickHouse & computing multi-agent strategy...
            </span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
        {quickPrompts.map((qp, qIdx) => (
          <button
            key={qIdx}
            onClick={() => handleSend(qp)}
            disabled={loading}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-glass)',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              padding: '6px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary-cyan)'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-glass)'}
          >
            <Sparkles size={12} color="var(--accent-gold)" />
            <span>{qp}</span>
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        style={{ display: 'flex', gap: '10px' }}
      >
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={`Ask Gemini Executive Director to analyze ${filmTitle} ClickHouse telemetry...`}
          disabled={loading}
          style={{
            flex: 1,
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid var(--border-glass)',
            borderRadius: '10px',
            padding: '12px 16px',
            color: 'var(--text-main)',
            fontSize: '0.9rem',
            outline: 'none'
          }}
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          <Send size={16} />
          <span>Instruct</span>
        </button>
      </form>

    </div>
  );
}
