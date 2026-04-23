function safeNumber(value) {
  return Number.isFinite(Number(value)) ? Number(value) : 0;
}

export default function AnalyticsPanel({ analytics = {} }) {
  const metrics = {
    daily: safeNumber(analytics?.daily ?? 42),
    weekly: safeNumber(analytics?.weekly ?? 180),
    monthly: safeNumber(analytics?.monthly ?? 740),
    yearly: safeNumber(analytics?.yearly ?? 8920),
    total: safeNumber(analytics?.total ?? 14520),
    growth: safeNumber(analytics?.growth ?? 12),
  };

  const bars = [
    { label: "Daily (Today)", value: metrics.daily },
    { label: "Weekly", value: metrics.weekly },
    { label: "Monthly", value: metrics.monthly },
    { label: "Yearly", value: metrics.yearly },
  ];

  const maxValue = Math.max(...bars.map((item) => item.value), 1);

  return (
    <div className="panel-shell">
      <div className="panel-header">
        <h3>Analytics</h3>
        <p>Visitors traffic and growth trends graph.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Total</span>
          <strong>{metrics.total}</strong>
        </div>
        <div className="stat-card">
          <span>Growth Trends</span>
          <strong>{metrics.growth}%</strong>
        </div>
      </div>

      <div className="bar-chart">
        {bars.map((item) => (
          <div key={item.label} className="bar-row">
            <div className="bar-label">{item.label}</div>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
            <div className="bar-value">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
