import { useMemo, useState } from "react";
import "../../styles/builder-site-insights-panel.css";

const EMPTY_ANALYTICS = Object.freeze({});

const TIME_RANGES = [
  { key: "today", label: "Today" },
  { key: "7d", label: "7 Days" },
  { key: "30d", label: "30 Days" },
  { key: "12m", label: "12 Months" },
];

const BREAKDOWN_TABS = [
  { key: "content", label: "Content" },
  { key: "sources", label: "Sources" },
  { key: "audience", label: "Audience" },
];

function toNumberOrNull(value) {
  if (value === null || value === undefined || value === "") return null;

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function toSafeArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function formatWholeNumber(value) {
  const number = toNumberOrNull(value);
  return number === null ? "—" : new Intl.NumberFormat().format(number);
}

function formatPercentage(value) {
  const number = toNumberOrNull(value);
  return number === null ? "—" : `${number.toFixed(number % 1 ? 1 : 0)}%`;
}

function formatCurrency(value, currency = "ZAR") {
  const number = toNumberOrNull(value);
  if (number === null) return "—";

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(number);
}

function formatDateTime(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function readFirstNumber(source = {}, keys = []) {
  for (const key of keys) {
    const value = toNumberOrNull(source?.[key]);
    if (value !== null) return value;
  }

  return null;
}

function readFirstArray(source = {}, keys = []) {
  for (const key of keys) {
    if (Array.isArray(source?.[key])) return source[key];
  }

  return [];
}

function normaliseTrendItem(item = {}, index = 0) {
  return {
    label: item.label || item.date || item.period || `${index + 1}`,
    value:
      readFirstNumber(item, [
        "sessions",
        "visits",
        "visitors",
        "value",
        "page_views",
        "pageViews",
      ]) ?? 0,
  };
}

function normaliseBreakdownItem(item = {}, index = 0) {
  return {
    id: item.id || item.key || item.path || item.name || `${index}`,
    label: item.label || item.name || item.path || item.country || "Unknown",
    value:
      readFirstNumber(item, [
        "sessions",
        "visits",
        "views",
        "page_views",
        "pageViews",
        "value",
        "users",
      ]) ?? 0,
    secondary:
      item.secondary ||
      item.title ||
      item.url ||
      item.percentage_label ||
      "",
  };
}

function normaliseDeviceItem(item = {}, index = 0) {
  const normalised = normaliseBreakdownItem(item, index);
  const percentage = readFirstNumber(item, ["percentage", "percent", "share"]);

  return {
    ...normalised,
    percentage,
  };
}

function hasLegacyMetrics(analytics = {}) {
  return ["daily", "weekly", "monthly", "yearly", "total", "growth"].some(
    (key) => toNumberOrNull(analytics?.[key]) !== null,
  );
}

function createLegacyRange(analytics = {}) {
  return {
    sessions: readFirstNumber(analytics, ["total", "monthly"]),
    visitors: readFirstNumber(analytics, ["total"]),
    growth: readFirstNumber(analytics, ["growth"]),
    trend: [
      { label: "Today", value: readFirstNumber(analytics, ["daily"]) ?? 0 },
      { label: "Week", value: readFirstNumber(analytics, ["weekly"]) ?? 0 },
      { label: "Month", value: readFirstNumber(analytics, ["monthly"]) ?? 0 },
      { label: "Year", value: readFirstNumber(analytics, ["yearly"]) ?? 0 },
    ],
  };
}

function getRangeSource(analytics = {}, rangeKey = "30d") {
  if (analytics?.ranges?.[rangeKey]) return analytics.ranges[rangeKey];
  if (analytics?.periods?.[rangeKey]) return analytics.periods[rangeKey];

  if (hasLegacyMetrics(analytics)) return createLegacyRange(analytics);

  return analytics;
}

function normaliseRangeData(analytics = {}, rangeKey = "30d") {
  const source = getRangeSource(analytics, rangeKey);

  return {
    visitors: readFirstNumber(source, [
      "unique_visitors",
      "uniqueVisitors",
      "visitors",
      "users",
    ]),
    sessions: readFirstNumber(source, ["sessions", "visits"]),
    pageViews: readFirstNumber(source, [
      "page_views",
      "pageViews",
      "views",
    ]),
    engagementRate: readFirstNumber(source, [
      "engagement_rate",
      "engagementRate",
    ]),
    growth: readFirstNumber(source, [
      "growth",
      "growth_percentage",
      "growthPercentage",
    ]),
    averageSession: source?.average_session || source?.averageSession || "",
    trend: readFirstArray(source, [
      "trend",
      "sessions_over_time",
      "sessionsOverTime",
      "traffic",
    ]).map(normaliseTrendItem),
    topPages: readFirstArray(source, [
      "top_pages",
      "topPages",
      "pages",
    ]).map(normaliseBreakdownItem),
    sources: readFirstArray(source, [
      "sources",
      "traffic_sources",
      "trafficSources",
      "channels",
    ]).map(normaliseBreakdownItem),
    countries: readFirstArray(source, [
      "countries",
      "sessions_by_country",
      "sessionsByCountry",
    ]).map(normaliseBreakdownItem),
    devices: readFirstArray(source, [
      "devices",
      "sessions_by_device",
      "sessionsByDevice",
    ]).map(normaliseDeviceItem),
    outcomes: source?.business_metrics || source?.businessMetrics || null,
  };
}

function hasDashboardData(data = {}) {
  return (
    data.visitors !== null ||
    data.sessions !== null ||
    data.pageViews !== null ||
    data.trend.length > 0 ||
    data.topPages.length > 0 ||
    data.sources.length > 0 ||
    data.devices.length > 0 ||
    data.countries.length > 0
  );
}

function comparisonLabel(growth) {
  const number = toNumberOrNull(growth);

  if (number === null) return null;

  return {
    positive: number >= 0,
    text: `${number >= 0 ? "↑" : "↓"} ${Math.abs(number).toFixed(
      number % 1 ? 1 : 0,
    )}%`,
  };
}

function makeLinePoints(values, width = 640, height = 188) {
  if (!values.length) return [];

  const maximum = Math.max(...values, 1);
  const minimum = Math.min(...values, 0);
  const range = Math.max(maximum - minimum, 1);
  const xPadding = 12;
  const yPadding = 12;
  const usableWidth = width - xPadding * 2;
  const usableHeight = height - yPadding * 2;

  return values.map((value, index) => ({
    x:
      xPadding +
      (values.length === 1 ? usableWidth / 2 : (index / (values.length - 1)) * usableWidth),
    y: yPadding + ((maximum - value) / range) * usableHeight,
  }));
}

function createPath(points = []) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
}

function createAreaPath(points = [], height = 188) {
  if (!points.length) return "";

  return `${createPath(points)} L ${points[points.length - 1].x} ${
    height - 2
  } L ${points[0].x} ${height - 2} Z`;
}

function MetricCard({ label, value, formatter = formatWholeNumber, growth, helper }) {
  const comparison = comparisonLabel(growth);

  return (
    <article className="bai-metric-card">
      <span>{label}</span>
      <strong>{formatter(value)}</strong>

      <div className="bai-metric-foot">
        {comparison ? (
          <small className={comparison.positive ? "is-positive" : "is-negative"}>
            {comparison.text}
          </small>
        ) : (
          <small className="is-muted">{helper || "No comparison yet"}</small>
        )}
      </div>
    </article>
  );
}

function SessionsChart({ data = [] }) {
  const values = data.map((item) => item.value);
  const points = makeLinePoints(values);
  const linePath = createPath(points);
  const areaPath = createAreaPath(points);
  const maximum = Math.max(...values, 0);

  if (!data.length) {
    return (
      <div className="bai-chart-empty">
        <span aria-hidden="true">⌁</span>
        <strong>No traffic trend available yet</strong>
        <p>Visitor activity will display here once analytics begins collecting data.</p>
      </div>
    );
  }

  return (
    <div className="bai-chart">
      <div className="bai-chart-top">
        <div>
          <strong>Sessions over time</strong>
          <small>Visitor sessions during this period</small>
        </div>
        <span>Peak {formatWholeNumber(maximum)}</span>
      </div>

      <svg
        className="bai-chart-svg"
        viewBox="0 0 640 188"
        role="img"
        aria-label="Sessions over time chart"
      >
        <line x1="0" x2="640" y1="47" y2="47" />
        <line x1="0" x2="640" y1="94" y2="94" />
        <line x1="0" x2="640" y1="141" y2="141" />

        <path className="bai-chart-area" d={areaPath} />
        <path className="bai-chart-line" d={linePath} />

        {points.map((point, index) => (
          <circle
            className="bai-chart-dot"
            key={`${data[index].label}-${index}`}
            cx={point.x}
            cy={point.y}
            r="4"
          />
        ))}
      </svg>

      <div className="bai-chart-labels">
        {data.map((item, index) => (
          <span key={`${item.label}-${index}`}>{item.label}</span>
        ))}
      </div>
    </div>
  );
}

function BarList({ items = [], emptyText }) {
  const maximum = Math.max(...items.map((item) => item.value), 1);

  if (!items.length) {
    return <p className="bai-small-empty">{emptyText}</p>;
  }

  return (
    <div className="bai-bar-list">
      {items.slice(0, 6).map((item) => (
        <div className="bai-bar-item" key={item.id}>
          <div className="bai-bar-copy">
            <strong>{item.label}</strong>
            <span>{formatWholeNumber(item.value)}</span>
          </div>

          <div className="bai-bar-track">
            <i style={{ width: `${(item.value / maximum) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Devices({ items = [] }) {
  const total = items.reduce((sum, item) => sum + item.value, 0);

  if (!items.length) {
    return <p className="bai-small-empty">Device data is not available yet.</p>;
  }

  return (
    <div className="bai-devices">
      {items.slice(0, 4).map((item) => {
        const share =
          item.percentage !== null && item.percentage !== undefined
            ? item.percentage
            : total
              ? (item.value / total) * 100
              : 0;

        return (
          <article key={item.id}>
            <span className="bai-device-icon" aria-hidden="true">
              {String(item.label).toLowerCase().includes("mobile")
                ? "▯"
                : String(item.label).toLowerCase().includes("tablet")
                  ? "▭"
                  : "▣"}
            </span>
            <strong>{item.label}</strong>
            <b>{formatPercentage(share)}</b>
            <small>{formatWholeNumber(item.value)} sessions</small>
          </article>
        );
      })}
    </div>
  );
}

function TopPages({ items = [] }) {
  if (!items.length) {
    return <p className="bai-small-empty">Top-page activity is not available yet.</p>;
  }

  return (
    <div className="bai-pages-table">
      {items.slice(0, 6).map((item, index) => (
        <div key={item.id}>
          <span>{index + 1}</span>
          <strong>{item.label}</strong>
          <small>{formatWholeNumber(item.value)}</small>
        </div>
      ))}
    </div>
  );
}

function BusinessOutcomes({ outcomes, currency = "ZAR" }) {
  if (!outcomes || typeof outcomes !== "object") return null;

  const cards = [
    {
      label: "Orders",
      value: readFirstNumber(outcomes, ["orders"]),
      formatter: formatWholeNumber,
    },
    {
      label: "Sales",
      value: readFirstNumber(outcomes, ["sales", "revenue"]),
      formatter: (value) => formatCurrency(value, currency),
    },
    {
      label: "Bookings",
      value: readFirstNumber(outcomes, ["bookings"]),
      formatter: formatWholeNumber,
    },
    {
      label: "Leads",
      value: readFirstNumber(outcomes, ["leads", "enquiries", "inquiries"]),
      formatter: formatWholeNumber,
    },
  ].filter((card) => card.value !== null);

  if (!cards.length) return null;

  return (
    <section className="bai-outcomes">
      <div className="bai-block-title">
        <h4>Business outcomes</h4>
        <p>Metrics relevant to the way this website is configured.</p>
      </div>

      <div className="bai-outcome-grid">
        {cards.map((card) => (
          <article key={card.label}>
            <span>{card.label}</span>
            <strong>{card.formatter(card.value)}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function AnalyticsPanel({
  analytics = EMPTY_ANALYTICS,
  loading = false,
  onRefresh,
  onConnectAnalytics,
  onExport,
  onRangeChange,
  title = "Site Insights",
  currency = "ZAR",
}) {
  const [rangeKey, setRangeKey] = useState("30d");
  const [activeBreakdown, setActiveBreakdown] = useState("content");

  const rangeData = useMemo(
    () => normaliseRangeData(analytics, rangeKey),
    [analytics, rangeKey],
  );

  const dataAvailable = hasDashboardData(rangeData);
  const connected =
    analytics?.connected === true ||
    analytics?.isConnected === true ||
    analytics?.tracking_enabled === true ||
    dataAvailable;

  const lastUpdated =
    formatDateTime(analytics?.last_updated || analytics?.lastUpdated) || "";

  const selectRange = (nextRange) => {
    setRangeKey(nextRange);
    onRangeChange?.(nextRange);
  };

  return (
    <section className="bai-root" aria-label={title}>
      <header className="bai-header">
        <div>
          <span className="bai-eyebrow">Performance</span>
          <h3>{title}</h3>
          <p>See who visits your website and what content performs best.</p>
        </div>

        <div className="bai-header-actions">
          {typeof onRefresh === "function" && (
            <button
              type="button"
              className="bai-icon-action"
              aria-label="Refresh site insights"
              title="Refresh"
              onClick={onRefresh}
              disabled={loading}
            >
              ↻
            </button>
          )}
        </div>
      </header>

      {!connected && !loading && (
        <section className="bai-connect">
          <div className="bai-connect-icon" aria-hidden="true">
            ◔
          </div>
          <h4>Start collecting website insights</h4>
          <p>
            Connect analytics or publish tracking to view real visitors,
            sessions, top pages, devices and traffic sources.
          </p>

          {typeof onConnectAnalytics === "function" && (
            <button type="button" onClick={onConnectAnalytics}>
              Connect Analytics
            </button>
          )}

          <small>No sample visitor numbers are shown before tracking is connected.</small>
        </section>
      )}

      {loading && (
        <div className="bai-loading" aria-label="Loading site insights">
          <div />
          <div />
          <div />
          <div className="bai-loading-chart" />
        </div>
      )}

      {(connected || dataAvailable) && !loading && (
        <>
          <div className="bai-toolbar">
            <nav className="bai-range" aria-label="Select reporting period">
              {TIME_RANGES.map((range) => (
                <button
                  type="button"
                  key={range.key}
                  className={rangeKey === range.key ? "is-active" : ""}
                  onClick={() => selectRange(range.key)}
                >
                  {range.label}
                </button>
              ))}
            </nav>

            <div className="bai-toolbar-foot">
              {lastUpdated && <small>Updated {lastUpdated}</small>}

              {typeof onExport === "function" && (
                <button type="button" onClick={() => onExport(rangeKey)}>
                  Export
                </button>
              )}
            </div>
          </div>

          <div className="bai-metrics">
            <MetricCard
              label="Visitors"
              value={rangeData.visitors}
              growth={rangeData.growth}
            />
            <MetricCard label="Sessions" value={rangeData.sessions} />
            <MetricCard label="Page Views" value={rangeData.pageViews} />
            <MetricCard
              label="Engagement"
              value={rangeData.engagementRate}
              formatter={formatPercentage}
            />
          </div>

          <SessionsChart data={rangeData.trend} />

          <BusinessOutcomes
            outcomes={rangeData.outcomes}
            currency={currency}
          />

          <section className="bai-breakdown">
            <div className="bai-block-title">
              <h4>Traffic details</h4>
              <p>Understand the content and visitors behind your growth.</p>
            </div>

            <nav className="bai-breakdown-tabs" aria-label="Traffic breakdown">
              {BREAKDOWN_TABS.map((tab) => (
                <button
                  type="button"
                  key={tab.key}
                  className={activeBreakdown === tab.key ? "is-active" : ""}
                  onClick={() => setActiveBreakdown(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {activeBreakdown === "content" && (
              <TopPages items={rangeData.topPages} />
            )}

            {activeBreakdown === "sources" && (
              <BarList
                items={rangeData.sources}
                emptyText="Traffic source data is not available yet."
              />
            )}

            {activeBreakdown === "audience" && (
              <>
                <h5 className="bai-mini-title">Devices</h5>
                <Devices items={rangeData.devices} />

                <h5 className="bai-mini-title">Countries</h5>
                <BarList
                  items={rangeData.countries}
                  emptyText="Country data is not available yet."
                />
              </>
            )}
          </section>

          <footer className="bai-footer">
            <p>
              Reports should use collected visitor data only. Connect a
              tracking source before using results for decisions.
            </p>
          </footer>
        </>
      )}
    </section>
  );
}
