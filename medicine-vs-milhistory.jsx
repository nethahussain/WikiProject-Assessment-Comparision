import { useState, useMemo } from "react";

const RAW_DATA = {
  "Medicine": {
    Stub: 11809,
    Start: 23893,
    "C-Class": 12528,
    "B-Class": 3834,
    GA: 412,
    FA: 63,
    "A-Class": 0,
    Unassessed: 333,
  },
  "Military History": {
    Stub: 27102,
    Start: 112690,
    "C-Class": 65648,
    "B-Class": 21828,
    GA: 5823,
    FA: 1560,
    "A-Class": 684,
    Unassessed: 3,
  },
};

const QUALITY_LEVELS = ["Stub", "Start", "C-Class", "B-Class", "GA", "FA"];
const COLORS = {
  Stub: "#dc6868",
  Start: "#e8a86d",
  "C-Class": "#e8d06d",
  "B-Class": "#7ec882",
  GA: "#5ba8c8",
  FA: "#9b72cf",
};

function computeStats(data) {
  const total = QUALITY_LEVELS.reduce((s, k) => s + data[k], 0);
  const pcts = {};
  QUALITY_LEVELS.forEach((k) => (pcts[k] = total > 0 ? (data[k] / total * 100) : 0));
  return { total, pcts };
}

function Bar({ pct, color, label, count, maxPct }) {
  const w = maxPct > 0 ? (pct / maxPct) * 100 : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
      <div style={{ width: 70, fontSize: 12, color: "#8a8a9a", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace" }}>{label}</div>
      <div style={{ flex: 1, background: "#1e1e2a", borderRadius: 4, height: 26, position: "relative", overflow: "hidden" }}>
        <div
          style={{
            width: `${w}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${color}cc, ${color})`,
            borderRadius: 4,
            transition: "width 0.6s cubic-bezier(.4,0,.2,1)",
            minWidth: pct > 0 ? 2 : 0,
          }}
        />
      </div>
      <div style={{ width: 95, fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", color: "#c8c8d8", textAlign: "right" }}>
        {pct.toFixed(1)}%
        <span style={{ color: "#6a6a7a", fontSize: 10, marginLeft: 4 }}>({count.toLocaleString()})</span>
      </div>
    </div>
  );
}

function ProjectCard({ name, data, stats, emoji }) {
  const maxPct = Math.max(...QUALITY_LEVELS.map((k) => stats.pcts[k]));
  return (
    <div style={{
      background: "#15151f",
      border: "1px solid #2a2a3a",
      borderRadius: 12,
      padding: "24px 28px",
      flex: 1,
      minWidth: 340,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <span style={{ fontSize: 22 }}>{emoji}</span>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: "#e8e8f0", fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.3px" }}>
          {name}
        </h2>
      </div>
      <div style={{ fontSize: 12, color: "#6a6a7a", marginBottom: 18, fontFamily: "'IBM Plex Mono', monospace", paddingLeft: 34 }}>
        {stats.total.toLocaleString()} assessed articles
      </div>
      {QUALITY_LEVELS.map((level) => (
        <Bar key={level} pct={stats.pcts[level]} color={COLORS[level]} label={level} count={data[level]} maxPct={maxPct} />
      ))}
    </div>
  );
}

function ComparisonRow({ label, medVal, mhVal, color, winner }) {
  return (
    <tr>
      <td style={{ padding: "8px 12px", borderBottom: "1px solid #1e1e2a", fontSize: 13, color: "#c8c8d8" }}>
        <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: color, marginRight: 8 }} />
        {label}
      </td>
      <td style={{
        padding: "8px 12px",
        borderBottom: "1px solid #1e1e2a",
        textAlign: "right",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 13,
        color: winner === "med" ? "#7ec882" : "#9a9aaa",
        fontWeight: winner === "med" ? 600 : 400,
      }}>
        {medVal.toFixed(2)}%
      </td>
      <td style={{
        padding: "8px 12px",
        borderBottom: "1px solid #1e1e2a",
        textAlign: "right",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 13,
        color: winner === "mh" ? "#7ec882" : "#9a9aaa",
        fontWeight: winner === "mh" ? 600 : 400,
      }}>
        {mhVal.toFixed(2)}%
      </td>
      <td style={{
        padding: "8px 12px",
        borderBottom: "1px solid #1e1e2a",
        textAlign: "right",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 13,
        color: Math.abs(mhVal - medVal) > 5 ? "#e8a86d" : "#6a6a7a",
      }}>
        {mhVal > medVal ? "+" : ""}{(mhVal - medVal).toFixed(2)}pp
      </td>
    </tr>
  );
}

export default function WikiProjectComparison() {
  const medStats = useMemo(() => computeStats(RAW_DATA["Medicine"]), []);
  const mhStats = useMemo(() => computeStats(RAW_DATA["Military History"]), []);

  const gaFaPctMed = medStats.pcts.GA + medStats.pcts.FA;
  const gaFaPctMH = mhStats.pcts.GA + mhStats.pcts.FA;
  const stubPctMed = medStats.pcts.Stub;
  const stubPctMH = mhStats.pcts.Stub;

  const hypothesisResults = [
    {
      claim: "Military History has higher GA+FA proportion",
      result: gaFaPctMH > gaFaPctMed,
      detail: `MilHist ${gaFaPctMH.toFixed(2)}% vs Medicine ${gaFaPctMed.toFixed(2)}%`,
    },
    {
      claim: "Military History has lower Stub proportion",
      result: stubPctMH < stubPctMed,
      detail: `MilHist ${stubPctMH.toFixed(2)}% vs Medicine ${stubPctMed.toFixed(2)}%`,
    },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0d0d14",
      color: "#e8e8f0",
      fontFamily: "'DM Sans', sans-serif",
      padding: "36px 24px",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: "#5ba8c8", fontWeight: 600, marginBottom: 6 }}>
            WikiProject Assessment Comparison
          </div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px", lineHeight: 1.2 }}>
            Medicine <span style={{ color: "#5a5a6a", fontWeight: 400 }}>vs</span> Military History
          </h1>
          <p style={{ color: "#6a6a7a", fontSize: 13, marginTop: 8, lineHeight: 1.5, fontFamily: "'IBM Plex Mono', monospace" }}>
            Data source: MediaWiki categoryinfo API · Category:*-Class [project] articles · Queried 2025-02-11
          </p>
        </div>

        {/* Scale legend */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
          {QUALITY_LEVELS.map((level) => (
            <div key={level} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#8a8a9a" }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: COLORS[level] }} />
              {level}
            </div>
          ))}
        </div>

        {/* Side-by-side cards */}
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 32 }}>
          <ProjectCard name="Medicine" data={RAW_DATA["Medicine"]} stats={medStats} emoji="⚕️" />
          <ProjectCard name="Military History" data={RAW_DATA["Military History"]} stats={mhStats} emoji="⚔️" />
        </div>

        {/* Comparison table */}
        <div style={{
          background: "#15151f",
          border: "1px solid #2a2a3a",
          borderRadius: 12,
          padding: "24px 28px",
          marginBottom: 28,
        }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, color: "#e8e8f0" }}>
            Proportional Comparison
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #2a2a3a" }}>
                  <th style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, color: "#6a6a7a", textTransform: "uppercase", letterSpacing: 1 }}>Class</th>
                  <th style={{ padding: "8px 12px", textAlign: "right", fontSize: 11, color: "#6a6a7a", textTransform: "uppercase", letterSpacing: 1 }}>Medicine</th>
                  <th style={{ padding: "8px 12px", textAlign: "right", fontSize: 11, color: "#6a6a7a", textTransform: "uppercase", letterSpacing: 1 }}>Military History</th>
                  <th style={{ padding: "8px 12px", textAlign: "right", fontSize: 11, color: "#6a6a7a", textTransform: "uppercase", letterSpacing: 1 }}>Δ (MH − Med)</th>
                </tr>
              </thead>
              <tbody>
                {QUALITY_LEVELS.map((level) => {
                  const medV = medStats.pcts[level];
                  const mhV = mhStats.pcts[level];
                  const isHighBetter = level === "GA" || level === "FA" || level === "B-Class";
                  const winner = isHighBetter ? (mhV > medV ? "mh" : "med") : (mhV < medV ? "mh" : "med");
                  return (
                    <ComparisonRow key={level} label={level} medVal={medV} mhVal={mhV} color={COLORS[level]} winner={winner} />
                  );
                })}
                <tr>
                  <td style={{ padding: "10px 12px", fontSize: 13, color: "#e8e8f0", fontWeight: 600 }}>
                    GA + FA
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: gaFaPctMed > gaFaPctMH ? "#7ec882" : "#9a9aaa", fontWeight: 600 }}>
                    {gaFaPctMed.toFixed(2)}%
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: gaFaPctMH > gaFaPctMed ? "#7ec882" : "#9a9aaa", fontWeight: 600 }}>
                    {gaFaPctMH.toFixed(2)}%
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "#e8a86d", fontWeight: 600 }}>
                    +{(gaFaPctMH - gaFaPctMed).toFixed(2)}pp
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Hypothesis testing */}
        <div style={{
          background: "#15151f",
          border: "1px solid #2a2a3a",
          borderRadius: 12,
          padding: "24px 28px",
          marginBottom: 28,
        }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, color: "#e8e8f0" }}>
            Hypothesis Testing
          </h3>
          {hypothesisResults.map((h, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              padding: "12px 0",
              borderBottom: i < hypothesisResults.length - 1 ? "1px solid #1e1e2a" : "none",
            }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: h.result ? "#1a3a1e" : "#3a1a1a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                flexShrink: 0,
                marginTop: 2,
              }}>
                {h.result ? "✓" : "✗"}
              </div>
              <div>
                <div style={{ fontSize: 14, color: "#e8e8f0", marginBottom: 4 }}>{h.claim}</div>
                <div style={{
                  fontSize: 12,
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: h.result ? "#7ec882" : "#dc6868",
                }}>
                  {h.result ? "CONFIRMED" : "REJECTED"} — {h.detail}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Key observations */}
        <div style={{
          background: "#15151f",
          border: "1px solid #2a2a3a",
          borderRadius: 12,
          padding: "24px 28px",
          marginBottom: 28,
        }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, color: "#e8e8f0" }}>
            Key Observations
          </h3>
          <div style={{ fontSize: 13, color: "#a8a8b8", lineHeight: 1.7 }}>
            <p style={{ margin: "0 0 12px" }}>
              <strong style={{ color: "#e8e8f0" }}>Scale difference:</strong>{" "}
              Military History oversees <span style={{ color: "#5ba8c8", fontFamily: "'IBM Plex Mono', monospace" }}>{mhStats.total.toLocaleString()}</span> assessed articles
              — roughly <span style={{ color: "#5ba8c8", fontFamily: "'IBM Plex Mono', monospace" }}>{Math.round(mhStats.total / medStats.total)}×</span> the size of Medicine
              (<span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{medStats.total.toLocaleString()}</span>).
            </p>
            <p style={{ margin: "0 0 12px" }}>
              <strong style={{ color: "#e8e8f0" }}>Stub burden:</strong>{" "}
              Medicine carries a significantly higher stub proportion at{" "}
              <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{stubPctMed.toFixed(1)}%</span> vs MilHist's{" "}
              <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{stubPctMH.toFixed(1)}%</span>.
              This likely reflects the sheer volume of medical topics (drugs, conditions, procedures) that get stub-tagged
              via WikiProject Medicine's broad scope.
            </p>
            <p style={{ margin: "0 0 12px" }}>
              <strong style={{ color: "#e8e8f0" }}>GA+FA quality tier:</strong>{" "}
              MilHist maintains a combined <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{gaFaPctMH.toFixed(1)}%</span> GA+FA proportion,
              vs <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{gaFaPctMed.toFixed(1)}%</span> for Medicine.
              In absolute terms: MilHist has <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{(RAW_DATA["Military History"].GA + RAW_DATA["Military History"].FA).toLocaleString()}</span> articles at GA/FA
              vs <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{(RAW_DATA["Medicine"].GA + RAW_DATA["Medicine"].FA).toLocaleString()}</span> for Medicine.
              MilHist's monthly writing contests and formal A-Class review process (684 A-Class articles) drive this advantage.
            </p>
            <p style={{ margin: "0 0 12px" }}>
              <strong style={{ color: "#e8e8f0" }}>B-Class strength:</strong>{" "}
              Medicine has a notably higher B-Class proportion (<span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{medStats.pcts["B-Class"].toFixed(1)}%</span>
              vs <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{mhStats.pcts["B-Class"].toFixed(1)}%</span>),
              reflecting WikiProject Medicine's emphasis on getting core medical articles to a reliable, well-referenced standard
              even if they don't proceed to GA/FA review.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: "#e8e8f0" }}>Methodology:</strong>{" "}
              Counts retrieved via the MediaWiki <code style={{ background: "#1e1e2a", padding: "2px 6px", borderRadius: 3, fontSize: 12 }}>categoryinfo</code> API
              on quality-class categories populated by WikiProject banner templates.
              Proportions exclude non-article pages (List, Redirect, Template, NA, etc.) and Unassessed articles.
            </p>
          </div>
        </div>

        <div style={{ textAlign: "center", fontSize: 11, color: "#3a3a4a", padding: "12px 0" }}>
          Data: en.wikipedia.org/w/api.php · categoryinfo query · Feb 2025
        </div>
      </div>
    </div>
  );
}
