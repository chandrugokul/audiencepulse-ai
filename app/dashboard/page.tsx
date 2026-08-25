"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Globe2,
  Languages,
  MessageCircleQuestion,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

type DataSet = {
  title: string;
  subtitle: string;
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

const dashboardData: Record<string, DataSet> = {
  "tamil-travel": {
    title: "Tamil Travel Audience",
    subtitle: "Demo analysis for Tamil + English travel audience",
    comments: 12480,
    positive: 68,
    neutral: 21,
    negative: 11,

    languages: [
      ["Tamil", 46],
      ["English", 39],
      ["Tamil + English", 11],
      ["Other", 4],
    ],

    countries: [
      ["India", 61],
      ["UAE", 13],
      ["Singapore", 8],
      ["Malaysia", 6],
      ["Other", 12],
    ],

    topics: [
      ["Chennai travel", 94],
      ["Budget travel", 88],
      ["Tamil Nadu food", 82],
      ["Hotels", 73],
    ],

    questions: [
      ["Which places can we visit in Chennai for one day?", 436],
      ["Can you show budget hotels?", 318],
      ["What is the best time to visit?", 247],
    ],

    recommendations: [
      {
        title: "10 Best Places to Visit in Chennai",
        score: 94,
        reason:
          "High repeated demand for Chennai travel recommendations.",
      },
      {
        title: "Chennai Budget Travel Guide",
        score: 89,
        reason:
          "Viewers repeatedly ask about low-cost travel options.",
      },
      {
        title: "Best Tamil Nadu Food Road Trip",
        score: 84,
        reason:
          "Food and destination requests frequently appear together.",
      },
    ],
  },

  "us-technology": {
    title: "US Technology Audience",
    subtitle: "Demo analysis for English-speaking technology audience",
    comments: 18360,
    positive: 74,
    neutral: 18,
    negative: 8,

    languages: [
      ["English", 91],
      ["Spanish", 4],
      ["Hindi", 2],
      ["Other", 3],
    ],

    countries: [
      ["USA", 54],
      ["Canada", 14],
      ["UK", 11],
      ["Australia", 7],
      ["Other", 14],
    ],

    topics: [
      ["AI tools", 96],
      ["Automation", 91],
      ["SaaS", 84],
      ["Developer tools", 79],
    ],

    questions: [
      ["Which AI tool is best for beginners?", 528],
      ["Can you compare these tools?", 421],
      ["How much does this cost?", 302],
    ],

    recommendations: [
      {
        title: "5 AI Tools Every Beginner Should Try",
        score: 96,
        reason:
          "AI tool comparisons show the strongest audience demand.",
      },
      {
        title: "Best AI Automation Tools for Creators",
        score: 92,
        reason:
          "Automation appears frequently in high-engagement comments.",
      },
      {
        title: "AI Tools: Free vs Paid Comparison",
        score: 87,
        reason:
          "Pricing and comparison questions are repeated often.",
      },
    ],
  },

  "hindi-finance": {
    title: "Hindi Finance Audience",
    subtitle: "Demo analysis for Hindi + English finance audience",
    comments: 15720,
    positive: 71,
    neutral: 20,
    negative: 9,

    languages: [
      ["Hindi", 52],
      ["English", 28],
      ["Hindi + English", 16],
      ["Other", 4],
    ],

    countries: [
      ["India", 78],
      ["UAE", 8],
      ["USA", 5],
      ["Singapore", 3],
      ["Other", 6],
    ],

    topics: [
      ["Mutual funds", 95],
      ["Beginner investing", 91],
      ["Savings", 84],
      ["Budgeting", 76],
    ],

    questions: [
      ["How should a beginner start investing?", 612],
      ["Which mutual fund is suitable for beginners?", 488],
      ["How much should I save every month?", 365],
    ],

    recommendations: [
      {
        title: "Mutual Funds for Complete Beginners",
        score: 95,
        reason:
          "Beginner investing questions dominate the comments.",
      },
      {
        title: "How to Start Investing with ₹1,000",
        score: 91,
        reason:
          "Viewers repeatedly ask about starting with small amounts.",
      },
      {
        title: "Monthly Budget Plan for Beginners",
        score: 83,
        reason:
          "Savings and budgeting requests show consistent demand.",
      },
    ],
  },
};

function DashboardContent() {
  const searchParams = useSearchParams();

  const datasetId =
    searchParams.get("dataset") || "tamil-travel";

  const data =
    dashboardData[datasetId] ||
    dashboardData["tamil-travel"];

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        {/* Back */}
        <button
          onClick={() => {
            window.location.href = "/";
          }}
          style={styles.backButton}
        >
          <ArrowLeft size={17} />
          Analyze another video
        </button>

        {/* Header */}
        <header style={styles.header}>
          <div>
            <div style={styles.demoBadge}>
              🟡 DEMO DATA
            </div>

            <h1 style={styles.title}>
              Audience Intelligence
            </h1>

            <p style={styles.subtitle}>
              {data.subtitle}
            </p>
          </div>

          <div style={styles.datasetBox}>
            <span style={{ color: "#64748b" }}>
              Dataset:
            </span>{" "}
            <strong>{data.title}</strong>
          </div>
        </header>

        {/* Metrics */}
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

        {/* Sentiment */}
        <section style={styles.card}>

          <SectionHeader
            icon={<BarChart3 size={22} />}
            title="Sentiment Analysis"
            subtitle="Overall audience reaction"
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

        {/* Language + Country */}
        <section style={styles.twoGrid}>

          <InsightCard
            title="Language Intelligence"
            icon={<Languages size={21} />}
          >
            {data.languages.map(([name, value]) => (
              <ProgressRow
                key={name}
                name={name}
                value={value}
              />
            ))}
          </InsightCard>

          <InsightCard
            title="Location Signals"
            icon={<Globe2 size={21} />}
          >
            {data.countries.map(([name, value]) => (
              <ProgressRow
                key={name}
                name={name}
                value={value}
              />
            ))}

            <p style={styles.note}>
              Location values are inferred signals for this
              demo and do not represent exact viewer locations.
            </p>
          </InsightCard>

        </section>

        {/* Topics */}
        <section style={styles.card}>

          <SectionHeader
            icon={<TrendingUp size={21} />}
            title="Trending Topics & Demand"
            subtitle="Topics your audience appears to care about"
          />

          <div style={styles.topicGrid}>

            {data.topics.map(([topic, score], index) => (
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
            ))}

          </div>
        </section>

        {/* Questions */}
        <section style={styles.card}>

          <SectionHeader
            icon={<MessageCircleQuestion size={21} />}
            title="Audience Question Miner"
            subtitle="Questions repeatedly appearing in audience comments"
          />

          <div>

            {data.questions.map(([question, count]) => (
              <div
                key={question}
                style={styles.questionItem}
              >

                <div style={{ flex: 1 }}>
                  <p style={styles.questionText}>
                    {question}
                  </p>

                  <p style={styles.questionCount}>
                    Asked {count.toLocaleString()} times
                  </p>
                </div>

                <span style={styles.opportunity}>
                  Opportunity
                </span>

              </div>
            ))}

          </div>
        </section>

        {/* Recommendations */}
        <section style={styles.darkCard}>

          <SectionHeader
            icon={<Sparkles size={23} />}
            title="What Should You Create Next?"
            subtitle="Demo content opportunity engine"
            dark
          />

          <div style={styles.recommendGrid}>

            {data.recommendations.map((item, index) => (
              <div
                key={item.title}
                style={styles.recommendCard}
              >

                <div style={styles.recommendTop}>

                  <span style={styles.number}>
                    #{index + 1}
                  </span>

                  <span style={styles.recommendScore}>
                    {item.score}/100
                  </span>

                </div>

                <h3 style={styles.recommendTitle}>
                  {item.title}
                </h3>

                <p style={styles.recommendReason}>
                  {item.reason}
                </p>

                <button style={styles.planButton}>
                  Create Content Plan
                </button>

              </div>
            ))}

          </div>
        </section>

        {/* Action Plan */}
        <section style={styles.card}>

          <SectionHeader
            icon={<CheckCircle2 size={22} />}
            title="AI Action Plan"
          />

          <div style={styles.threeGrid}>

            <Action
              number="1"
              text={`Create content around "${data.topics[0][0]}".`}
            />

            <Action
              number="2"
              text={`Answer the audience question: "${data.questions[0][0]}"`}
            />

            <Action
              number="3"
              text={`Prioritize the topic with a ${data.topics[0][1]}/100 demand score.`}
            />

          </div>
        </section>

        <footer style={styles.footer}>
          AudiencePulse AI • POC Demo • Data shown is simulated
        </footer>

      </div>
    </main>
  );
}

/* ---------------- Components ---------------- */

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
    <div style={styles.card}>

      <div style={styles.sectionHeader}>
        {icon}
        <h2 style={styles.sectionTitle}>
          {title}
        </h2>
      </div>

      {children}

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

      <div
        style={{
          color: dark ? "#fff" : "#0f172a",
        }}
      >
        {icon}
      </div>

      <div>
        <h2
          style={{
            ...styles.sectionTitle,
            color: dark ? "#fff" : "#0f172a",
          }}
        >
          {title}
        </h2>

        {subtitle && (
          <p
            style={{
              ...styles.sectionSubtitle,
              color: dark ? "#94a3b8" : "#64748b",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

    </div>
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

/* ---------------- Styles ---------------- */

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    color: "#0f172a",
    padding: "24px 16px",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  },

  container: {
    width: "100%",
    maxWidth: 1200,
    margin: "0 auto",
  },

  backButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontWeight: 600,
    color: "#475569",
    padding: "8px 0",
    marginBottom: 22,
    fontSize: 14,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 20,
    flexWrap: "wrap",
    marginBottom: 28,
  },

  demoBadge: {
    display: "inline-block",
    background: "#fef3c7",
    color: "#92400e",
    padding: "7px 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    marginBottom: 12,
  },

  title: {
    fontSize: "clamp(30px, 6vw, 44px)",
    lineHeight: 1.1,
    margin: 0,
    fontWeight: 800,
    letterSpacing: "-1px",
  },

  subtitle: {
    color: "#64748b",
    marginTop: 10,
    fontSize: 15,
  },

  datasetBox: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: "12px 16px",
    fontSize: 14,
    boxShadow: "0 2px 8px rgba(15,23,42,.04)",
  },

  metricsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(210px, 1fr))",
    gap: 16,
    marginBottom: 18,
  },

  metricCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 18,
    padding: 20,
    boxShadow: "0 3px 12px rgba(15,23,42,.05)",
  },

  metricIcon: {
    color: "#475569",
  },

  metricTitle: {
    color: "#64748b",
    fontSize: 14,
    marginTop: 16,
    marginBottom: 4,
  },

  metricValue: {
    fontSize: 28,
    fontWeight: 800,
    margin: 0,
  },

  card: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 20,
    padding: 22,
    marginTop: 18,
    boxShadow: "0 3px 12px rgba(15,23,42,.05)",
  },

  darkCard: {
    background: "#0f172a",
    borderRadius: 24,
    padding: 24,
    marginTop: 18,
    color: "#fff",
    boxShadow: "0 5px 20px rgba(15,23,42,.12)",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },

  sectionTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 800,
  },

  sectionSubtitle: {
    margin: "4px 0 0",
    fontSize: 13,
  },

  threeGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 14,
  },

  twoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 18,
  },

  sentimentCard: {
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    padding: 16,
  },

  sentimentTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    fontSize: 14,
  },

  progressBackground: {
    height: 8,
    background: "#e2e8f0",
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 10,
  },

  progressFill: {
    height: "100%",
    background: "#0f172a",
    borderRadius: 999,
  },

  progressTop: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 14,
    marginBottom: 7,
    color: "#475569",
  },

  note: {
    color: "#94a3b8",
    fontSize: 12,
    lineHeight: 1.5,
    marginTop: 4,
  },

  topicGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 12,
  },

  topicItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    padding: 14,
  },

  topicLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  rank: {
    width: 32,
    height: 32,
    borderRadius: 9,
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 13,
  },

  topicName: {
    fontWeight: 700,
    fontSize: 14,
  },

  score: {
    background: "#0f172a",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 800,
    whiteSpace: "nowrap",
  },

  questionItem: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexWrap: "wrap",
  },

  questionText: {
    margin: 0,
    fontWeight: 700,
    fontSize: 14,
    lineHeight: 1.5,
  },

  questionCount: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: 12,
  },

  opportunity: {
    background: "#fef3c7",
    color: "#92400e",
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 800,
  },

  recommendGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 14,
  },

  recommendCard: {
    background: "rgba(255,255,255,.08)",
    border: "1px solid rgba(255,255,255,.10)",
    borderRadius: 18,
    padding: 18,
  },

  recommendTop: {
    display: "flex",
    justifyContent: "space-between",
  },

  number: {
    color: "#94a3b8",
    fontWeight: 800,
  },

  recommendScore: {
    background: "#fff",
    color: "#0f172a",
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 800,
  },

  recommendTitle: {
    fontSize: 18,
    lineHeight: 1.3,
    margin: "18px 0 0",
  },

  recommendReason: {
    color: "#cbd5e1",
    fontSize: 13,
    lineHeight: 1.6,
    minHeight: 62,
  },

  planButton: {
    width: "100%",
    border: "none",
    borderRadius: 12,
    padding: "12px 14px",
    background: "#fff",
    color: "#0f172a",
    fontWeight: 800,
    cursor: "pointer",
    marginTop: 10,
  },

  actionCard: {
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    padding: 16,
  },

  actionNumber: {
    width: 32,
    height: 32,
    borderRadius: 999,
    background: "#0f172a",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 800,
    marginBottom: 12,
  },

  actionText: {
    color: "#475569",
    fontSize: 13,
    lineHeight: 1.6,
    margin: 0,
  },

  footer: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 11,
    padding: "32px 0 12px",
  },
};

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "system-ui",
          }}
        >
          Loading AudiencePulse...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}