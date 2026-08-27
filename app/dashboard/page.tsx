"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  Globe2,
  Languages,
  MessageCircleQuestion,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

type AnalysisData = {
  source?: string;
  commentsAnalyzed: number;
  comments: string[];

  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
};

type DashboardData = {
  comments: number;
  positive: number;
  neutral: number;
  negative: number;

  languages: [string, number][];
  countries: [string, number][];
  topics: [string, number][];
  questions: [string, number][];

  recommendations: {
    title: string;
    score: number;
    reason: string;
  }[];
};

function DashboardContent() {
  const searchParams = useSearchParams();

  const [analysis, setAnalysis] =
    useState<AnalysisData | null>(null);

  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(
        "audiencepulse-analysis"
      );

      if (!stored) {
        setError(
          "No analysis data found. Please analyze a CSV file first."
        );
        return;
      }

      const parsed = JSON.parse(stored);

      if (
        !parsed ||
        !Array.isArray(parsed.comments)
      ) {
        setError(
          "Invalid analysis data. Please upload the CSV again."
        );
        return;
      }

      setAnalysis(parsed);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load analysis data."
      );
    }
  }, []);

  const source =
    searchParams.get("source") || "csv";

  if (error) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <button
            onClick={() => {
              window.location.href = "/";
            }}
            style={styles.backButton}
          >
            <ArrowLeft size={17} />
            Analyze another video
          </button>

          <div style={styles.errorCard}>
            {error}
          </div>
        </div>
      </main>
    );
  }

  if (!analysis) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loadingCard}>
            Loading audience analysis...
          </div>
        </div>
      </main>
    );
  }

  const data = buildDashboardData(analysis);

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        <button
          onClick={() => {
            window.location.href = "/";
          }}
          style={styles.backButton}
        >
          <ArrowLeft size={17} />
          Analyze another video
        </button>

        <header style={styles.header}>
          <div>
            <div style={styles.badge}>
              {source === "csv"
                ? "📄 CSV ANALYSIS"
                : "▶️ YOUTUBE ANALYSIS"}
            </div>

            <h1 style={styles.title}>
              Audience Intelligence
            </h1>

            <p style={styles.subtitle}>
              Real audience insights generated from
              your uploaded comments.
            </p>
          </div>

          <div style={styles.sourceBox}>
            Source:{" "}
            <strong>
              {source === "csv"
                ? "CSV Comments"
                : "YouTube"}
            </strong>
          </div>
        </header>

        <section style={styles.metricsGrid}>

          <Metric
            icon={<Users size={22} />}
            title="Comments Analyzed"
            value={data.comments.toLocaleString()}
          />

          <Metric
            icon={<Languages size={22} />}
            title="Languages"
            value={String(data.languages.length)}
          />

          <Metric
            icon={<Globe2 size={22} />}
            title="Countries"
            value={String(data.countries.length)}
          />

          <Metric
            icon={<MessageCircleQuestion size={22} />}
            title="Top Questions"
            value={String(data.questions.length)}
          />

        </section>
  return (
    <main style={styles.page}>
      <div style={styles.container}>

        <button
          onClick={() => {
            sessionStorage.removeItem(
              "audiencepulse-analysis"
            );

            window.location.href = "/";
          }}
          style={styles.backButton}
        >
          <ArrowLeft size={17} />
          Analyze another video
        </button>

        <header style={styles.header}>
          <div>
            <div style={styles.demoBadge}>
              {source === "csv"
                ? "📄 CSV ANALYSIS"
                : "▶️ YOUTUBE ANALYSIS"}
            </div>

            <h1 style={styles.title}>
              Audience Intelligence
            </h1>

            <p style={styles.subtitle}>
              {source === "csv"
                ? "Analysis generated from your uploaded YouTube comments CSV."
                : "Audience analysis results."}
            </p>
          </div>

          <div style={styles.datasetBox}>
            <span style={{ color: "#64748b" }}>
              Comments:
            </span>{" "}
            <strong>
              {data.comments.toLocaleString()}
            </strong>
          </div>
        </header>

        {/* METRICS */}

        <section style={styles.metricsGrid}>

          <Metric
            icon={<Users size={22} />}
            title="Comments Analyzed"
            value={data.comments.toLocaleString()}
          />

          <Metric
            icon={<Languages size={22} />}
            title="Languages"
            value={String(data.languages.length)}
          />

          <Metric
            icon={<Globe2 size={22} />}
            title="Location Signals"
            value={String(data.countries.length)}
          />

          <Metric
            icon={<MessageCircleQuestion size={22} />}
            title="Questions Found"
            value={String(data.questions.length)}
          />

        </section>

        {/* SENTIMENT */}

        <section style={styles.card}>

          <SectionHeader
            icon={<BarChart3 size={22} />}
            title="Sentiment Analysis"
            subtitle="Audience reaction detected from comments"
          />

          <div style={styles.threeGrid}>

            <Sentiment
              label="Positive"
              value={data.positive}
              symbol="😊"
            />

            <Sentiment
              label="Neutral"
              value={data.neutral}
              symbol="😐"
            />

            <Sentiment
              label="Negative"
              value={data.negative}
              symbol="😕"
            />

          </div>

        </section>

        {/* LANGUAGE + LOCATION */}

        <section style={styles.twoGrid}>

          <InsightCard
            title="Language Intelligence"
            icon={<Languages size={21} />}
          >
            {data.languages.map(
              ([name, value]) => (
                <ProgressRow
                  key={name}
                  name={name}
                  value={value}
                />
              )
            )}
          </InsightCard>

          <InsightCard
            title="Location Signals"
            icon={<Globe2 size={21} />}
          >
            {data.countries.map(
              ([name, value]) => (
                <ProgressRow
                  key={name}
                  name={name}
                  value={value}
                />
              )
            )}

            <p style={styles.note}>
              Location cannot be reliably detected
              from ordinary comment text. This section
              shows only signals available from the CSV.
            </p>
          </InsightCard>

        </section>

        {/* TOPICS */}

        <section style={styles.card}>

          <SectionHeader
            icon={<Sparkles size={21} />}
            title="Trending Topics & Demand"
            subtitle="Topics detected from uploaded comments"
          />

          <div style={styles.topicGrid}>

            {data.topics.map(
              ([topic, score], index) => (
                <div
                  key={topic}
                  style={styles.topicItem}
                >
                  <div style={styles.topicLeft}>

                    <span style={styles.rank}>
                      {index + 1}
                    </span>

                    <span style={styles.topicName}>
                      {topic}
                    </span>

                  </div>

                  <span style={styles.score}>
                    {score}/100
                  </span>
                </div>
              )
            )}

          </div>

        </section>

        {/* QUESTIONS */}

        <section style={styles.card}>

          <SectionHeader
            icon={
              <MessageCircleQuestion size={21} />
            }
            title="Audience Question Miner"
            subtitle="Questions detected in the uploaded comments"
          />

          {data.questions.length === 0 ? (
            <p style={styles.emptyText}>
              No questions were detected in this CSV.
            </p>
          ) : (
            data.questions.map(
              ([question, count]) => (
                <div
                  key={question}
                  style={styles.questionItem}
                >

                  <div style={{ flex: 1 }}>
                    <p style={styles.questionText}>
                      {question}
                    </p>

                    <p style={styles.questionCount}>
                      Detected in audience comments
                    </p>
                  </div>

                  <span style={styles.opportunity}>
                    Opportunity
                  </span>

                </div>
              )
            )
          )}

        </section>

        {/* RECOMMENDATIONS */}

        <section style={styles.darkCard}>

          <SectionHeader
            icon={<Sparkles size={23} />}
            title="What Should You Create Next?"
            subtitle="Content opportunities generated from your CSV"
            dark
          />

          <div style={styles.recommendGrid}>

            {data.recommendations.map(
              (item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  style={styles.recommendCard}
                >

                  <div style={styles.recommendTop}>

                    <span style={styles.number}>
                      #{index + 1}
                    </span>

                    <span
                      style={styles.recommendScore}
                    >
                      {item.score}/100
                    </span>

                  </div>

                  <h3
                    style={styles.recommendTitle}
                  >
                    {item.title}
                  </h3>

                  <p
                    style={styles.recommendReason}
                  >
                    {item.reason}
                  </p>

                </div>
              )
            )}

          </div>

        </section>

        {/* ACTION PLAN */}

        <section style={styles.card}>

          <SectionHeader
            icon={<CheckCircle2 size={22} />}
            title="AI Action Plan"
          />

          <div style={styles.threeGrid}>

            <Action
              number="1"
              text={`Focus on "${data.topics[0]?.[0] || "Audience Discussion"}".`}
            />

            <Action
              number="2"
              text={
                data.questions[0]?.[0]
                  ? `Answer: "${data.questions[0][0]}"`
                  : "Create content based on repeated audience comments."
              }
            />

            <Action
              number="3"
              text={`Use the highest demand score of ${
                data.topics[0]?.[1] || 0
              }/100 to prioritize your next video.`}
            />

          </div>

        </section>

        <footer style={styles.footer}>
          AudiencePulse AI • CSV Analysis • POC
        </footer>

      </div>
    </main>
  );
}

function Metric({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div style={styles.metricCard}>
      <div style={styles.metricIcon}>
        {icon}
      </div>

      <p style={styles.metricTitle}>
        {title}
      </p>

      <p style={styles.metricValue}>
        {value}
      </p>
    </div>
  );
}

function Sentiment({
  label,
  value,
  symbol,
}: {
  label: string;
  value: number;
  symbol: string;
}) {
  return (
    <div style={styles.sentimentCard}>

      <div style={styles.sentimentTop}>
        <span>
          {symbol} {label}
        </span>

        <strong>{value}%</strong>
      </div>

      <div style={styles.progressBackground}>
        <div
          style={{
            ...styles.progressFill,
            width: `${value}%`,
          }}
        />
      </div>

    </div>
  );
}

function ProgressRow({
  name,
  value,
}: {
  name: string;
  value: number;
}) {
  return (
    <div style={{ marginBottom: 18 }}>

      <div style={styles.progressTop}>
        <span>{name}</span>

        <strong>{value}%</strong>
      </div>

      <div style={styles.progressBackground}>
        <div
          style={{
            ...styles.progressFill,
            width: `${value}%`,
          }}
        />
      </div>

    </div>
  );
}
function SectionHeader({
  icon,
  title,
  subtitle,
  dark = false,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  dark?: boolean;
}) {
  return (
    <div style={styles.sectionHeader}>
      <div style={dark ? styles.darkSectionIcon : styles.sectionIcon}>
        {icon}
      </div>

      <div>
        <h2
          style={
            dark
              ? styles.darkSectionTitle
              : styles.sectionTitle
          }
        >
          {title}
        </h2>

        {subtitle && (
          <p
            style={
              dark
                ? styles.darkSectionSubtitle
                : styles.sectionSubtitle
            }
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

function InsightCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section style={styles.card}>
      <div style={styles.sectionHeader}>
        <div style={styles.sectionIcon}>
          {icon}
        </div>

        <h2 style={styles.sectionTitle}>
          {title}
        </h2>
      </div>

      <div style={{ marginTop: 22 }}>
        {children}
      </div>
    </section>
  );
}

function Action({
  number,
  text,
}: {
  number: string;
  text: string;
}) {
  return (
    <div style={styles.actionCard}>
      <div style={styles.actionNumber}>
        {number}
      </div>

      <p style={styles.actionText}>
        {text}
      </p>
    </div>
  );
}

const styles: Record<
  string,
  React.CSSProperties
> = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    color: "#0f172a",
    padding: "24px 14px 60px",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  },

  container: {
    width: "100%",
    maxWidth: 1120,
    margin: "0 auto",
  },

  backButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    border: "none",
    background: "transparent",
    color: "#475569",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    padding: "7px 0",
    marginBottom: 20,
  },

  header: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 20,
    marginBottom: 25,
  },

  demoBadge: {
    display: "inline-flex",
    alignItems: "center",
    background: "#fef3c7",
    color: "#92400e",
    borderRadius: 999,
    padding: "6px 10px",
    fontSize: 10,
    fontWeight: 900,
    marginBottom: 10,
  },

  title: {
    margin: 0,
    fontSize: "clamp(32px, 7vw, 52px)",
    lineHeight: 1.05,
    letterSpacing: "-1.8px",
    fontWeight: 900,
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#64748b",
    fontSize: 14,
    lineHeight: 1.6,
  },

  datasetBox: {
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    borderRadius: 12,
    padding: "10px 13px",
    fontSize: 12,
    whiteSpace: "nowrap",
  },

  metricsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 12,
    marginBottom: 14,
  },

  metricCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 17,
    padding: 18,
    boxShadow:
      "0 5px 18px rgba(15,23,42,.04)",
  },

  metricIcon: {
    color: "#475569",
    marginBottom: 12,
  },

  metricTitle: {
    margin: 0,
    color: "#64748b",
    fontSize: 12,
    fontWeight: 700,
  },

  metricValue: {
    margin: "5px 0 0",
    fontSize: 25,
    fontWeight: 900,
    color: "#0f172a",
  },

  card: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 19,
    padding: "20px",
    marginBottom: 14,
    boxShadow:
      "0 5px 18px rgba(15,23,42,.04)",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: 11,
  },

  sectionIcon: {
    width: 38,
    height: 38,
    minWidth: 38,
    borderRadius: 11,
    background: "#f1f5f9",
    color: "#334155",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  sectionTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: 850,
    color: "#0f172a",
  },

  sectionSubtitle: {
    margin: "3px 0 0",
    color: "#94a3b8",
    fontSize: 11,
  },

  threeGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 10,
    marginTop: 18,
  },

  sentimentCard: {
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    padding: 13,
  },

  sentimentTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    fontSize: 12,
    color: "#475569",
  },

  progressBackground: {
    height: 7,
    background: "#e2e8f0",
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 9,
  },

  progressFill: {
    height: "100%",
    background: "#0f172a",
    borderRadius: 999,
  },

  twoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 14,
  },

  progressTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: "#475569",
    fontSize: 12,
    marginBottom: 6,
  },

  note: {
    margin: "4px 0 0",
    color: "#94a3b8",
    fontSize: 10,
    lineHeight: 1.5,
  },

  topicGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 10,
    marginTop: 18,
  },

  topicItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    border: "1px solid #e2e8f0",
    borderRadius: 13,
    padding: 11,
  },

  topicLeft: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    minWidth: 0,
  },

  rank: {
    width: 27,
    height: 27,
    borderRadius: 8,
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 900,
    flexShrink: 0,
  },

  topicName: {
    fontSize: 12,
    fontWeight: 750,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  score: {
    background: "#0f172a",
    color: "#ffffff",
    borderRadius: 999,
    padding: "5px 8px",
    fontSize: 10,
    fontWeight: 900,
    whiteSpace: "nowrap",
  },

  questionItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    border: "1px solid #e2e8f0",
    borderRadius: 13,
    padding: 13,
    marginTop: 9,
  },

  questionText: {
    margin: 0,
    fontSize: 12,
    fontWeight: 750,
    color: "#334155",
    lineHeight: 1.5,
  },

  questionCount: {
    margin: "4px 0 0",
    color: "#94a3b8",
    fontSize: 10,
  },

  opportunity: {
    background: "#fef3c7",
    color: "#92400e",
    borderRadius: 999,
    padding: "5px 8px",
    fontSize: 9,
    fontWeight: 900,
    whiteSpace: "nowrap",
  },

  emptyText: {
    color: "#94a3b8",
    fontSize: 13,
    margin: "18px 0 0",
  },

  darkCard: {
    background: "#0f172a",
    color: "#ffffff",
    borderRadius: 19,
    padding: 20,
    marginBottom: 14,
  },

  darkSectionIcon: {
    width: 38,
    height: 38,
    minWidth: 38,
    borderRadius: 11,
    background: "#1e293b",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  darkSectionTitle: {
    margin: 0,
    fontSize: 17,
    fontWeight: 850,
    color: "#ffffff",
  },

  darkSectionSubtitle: {
    margin: "3px 0 0",
    color: "#94a3b8",
    fontSize: 11,
  },

  recommendGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(230px, 1fr))",
    gap: 11,
    marginTop: 18,
  },

  recommendCard: {
    background: "#172033",
    border: "1px solid #273449",
    borderRadius: 14,
    padding: 16,
  },

  recommendTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  number: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: 800,
  },

  recommendScore: {
    background: "#ffffff",
    color: "#0f172a",
    borderRadius: 999,
    padding: "5px 8px",
    fontSize: 9,
    fontWeight: 900,
  },

  recommendTitle: {
    margin: "22px 0 0",
    color: "#ffffff",
    fontSize: 15,
    lineHeight: 1.35,
    fontWeight: 850,
  },

  recommendReason: {
    margin: "9px 0 0",
    color: "#94a3b8",
    fontSize: 11,
    lineHeight: 1.5,
  },

  actionCard: {
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    padding: 14,
  },

  actionNumber: {
    width: 28,
    height: 28,
    borderRadius: 9,
    background: "#0f172a",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 900,
  },

  actionText: {
    margin: "12px 0 0",
    color: "#475569",
    fontSize: 12,
    lineHeight: 1.55,
  },

  footer: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 11,
    paddingTop: 18,
  },
};