import { NextResponse } from "next/server";

type SentimentResult = {
  positive: number;
  neutral: number;
  negative: number;
};

type LanguageResult = {
  hindi: number;
  english: number;
  tamil: number;
  other: number;
};

type QuestionResult = {
  question: string;
  count: number;
};

function parseCSVLine(line: string): string[] {
  const columns: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      columns.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  columns.push(current.trim());

  return columns;
}

function detectLanguage(text: string): "hindi" | "english" | "tamil" | "other" {
  if (/[\u0900-\u097F]/.test(text)) {
    return "hindi";
  }

  if (/[\u0B80-\u0BFF]/.test(text)) {
    return "tamil";
  }

  if (/[a-zA-Z]/.test(text)) {
    return "english";
  }

  return "other";
}

function calculateSentiment(comments: string[]): SentimentResult {
  const positiveWords = [
    "good",
    "great",
    "awesome",
    "amazing",
    "love",
    "best",
    "excellent",
    "helpful",
    "nice",
    "useful",
    "நல்ல",
    "சூப்பர்",
    "அருமை",
    "நன்று",
  ];

  const negativeWords = [
    "bad",
    "worst",
    "hate",
    "terrible",
    "poor",
    "useless",
    "boring",
    "wrong",
    "fake",
    "பிடிக்கவில்லை",
    "மோசம்",
    "தவறு",
  ];

  let positiveCount = 0;
  let negativeCount = 0;

  for (const comment of comments) {
    const lower = comment.toLowerCase();

    if (
      positiveWords.some((word) =>
        lower.includes(word.toLowerCase())
      )
    ) {
      positiveCount++;
    }

    if (
      negativeWords.some((word) =>
        lower.includes(word.toLowerCase())
      )
    ) {
      negativeCount++;
    }
  }

  const total = comments.length;

  if (total === 0) {
    return {
      positive: 0,
      neutral: 0,
      negative: 0,
    };
  }

  const positive = Math.round((positiveCount / total) * 100);
  const negative = Math.round((negativeCount / total) * 100);

  const neutral = Math.max(
    0,
    100 - positive - negative
  );

  return {
    positive,
    neutral,
    negative,
  };
}

function calculateLanguages(
  comments: string[]
): LanguageResult {
  let hindi = 0;
  let english = 0;
  let tamil = 0;
  let other = 0;

  for (const comment of comments) {
    const language = detectLanguage(comment);

    if (language === "hindi") hindi++;
    else if (language === "english") english++;
    else if (language === "tamil") tamil++;
    else other++;
  }

  const total = comments.length;

  if (total === 0) {
    return {
      hindi: 0,
      english: 0,
      tamil: 0,
      other: 0,
    };
  }

  return {
    hindi: Math.round((hindi / total) * 100),
    english: Math.round((english / total) * 100),
    tamil: Math.round((tamil / total) * 100),
    other: Math.round((other / total) * 100),
  };
}
// ================================
// Part 2/3
// ================================

function buildDashboardData(analysis: any) {
  const comments: string[] = Array.isArray(analysis?.comments)
    ? analysis.comments
    : [];

  const total = comments.length;

  const positive =
    Number(analysis?.sentiment?.positive ?? 0);

  const neutral =
    Number(analysis?.sentiment?.neutral ?? 0);

  const negative =
    Number(analysis?.sentiment?.negative ?? 0);

  const questionComments = comments.filter((comment) =>
    comment.includes("?") ||
    /^(how|what|why|when|where|which|can|could|should|is|are|do|does|எப்படி|என்ன|ஏன்|எப்போது|எங்கே)/i.test(
      comment.trim()
    )
  );

  const hindiHits = comments.filter((comment) =>
    /[\u0900-\u097F]/.test(comment)
  ).length;

  const tamilHits = comments.filter((comment) =>
    /[\u0B80-\u0BFF]/.test(comment)
  ).length;

  const englishHits = comments.filter((comment) =>
    /[a-zA-Z]/.test(comment)
  ).length;

  const languageTotal =
    tamilHits + hindiHits + englishHits;

  const languages: [string, number][] =
    languageTotal > 0
      ? [
          [
            "Tamil",
            Math.round((tamilHits / languageTotal) * 100),
          ],
          [
            "Hindi",
            Math.round((hindiHits / languageTotal) * 100),
          ],
          [
            "English",
            Math.round((englishHits / languageTotal) * 100),
          ],
        ].filter(
          (item): item is [string, number] => item[1] > 0
        )
      : [];

  const topics: [string, number][] = [
    [
      "Viewer interest",
      Math.min(95, 60 + positive),
    ],
    [
      "Content questions",
      Math.min(
        90,
        40 + questionComments.length * 5
      ),
    ],
    [
      "Audience requests",
      Math.min(85, 35 + comments.length),
    ],
    [
      "Engagement",
      Math.min(
        80,
        30 + Math.round(total / 10)
      ),
    ],
  ];

  const questions: [string, number][] =
    questionComments.length > 0
      ? questionComments
          .slice(0, 5)
          .map((comment) => [
            comment,
            1,
          ] as [string, number])
      : [];

  const recommendations = [
    {
      title: "Create a follow-up video",
      score: Math.min(
        98,
        70 + Math.round(positive / 5)
      ),
      reason:
        "Your audience is showing strong interest. Build a follow-up video around the most repeated audience signals.",
    },
    {
      title: "Answer audience questions",
      score: Math.min(
        95,
        65 + questionComments.length * 5
      ),
      reason:
        "Repeated questions can become highly useful educational content.",
    },
    {
      title: "Create a beginner-friendly guide",
      score: Math.min(
        92,
        60 + Math.round(total / 10)
      ),
      reason:
        "Turn common audience discussions into a simple step-by-step video.",
    },
  ];

  const actions = [
    "Focus your next video on the highest demand topic.",
    "Answer repeated audience questions directly in your content.",
    "Use audience language signals to improve titles and descriptions.",
  ];

  return {
    total,
    positive,
    neutral,
    negative,
    languages,
    topics,
    questions,
    recommendations,
    actions,
    comments,
  };
}

// ================================
// Helper Components
// ================================

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: string;
}) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statIcon}>{icon}</div>

      <div>
        <div style={styles.statTitle}>{title}</div>
        <div style={styles.statValue}>{value}</div>
      </div>
    </div>
  );
}

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div style={styles.sectionTitle}>
      <h2 style={styles.sectionHeading}>
        {title}
      </h2>

      {subtitle && (
        <p style={styles.sectionSubtitle}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function ProgressBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div style={styles.progressRow}>
      <div style={styles.progressHeader}>
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>

      <div style={styles.progressTrack}>
        <div
          style={{
            ...styles.progressFill,
            width: `${Math.max(
              0,
              Math.min(100, value)
            )}%`,
          }}
        />
      </div>
    </div>
  );
}

// ================================
// Dashboard Page
// ================================

export default function DashboardPage() {
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        "audiencepulse-analysis"
      );

      if (saved) {
        setAnalysis(JSON.parse(saved));
      }
    } catch (error) {
      console.error(
        "Unable to load saved analysis:",
        error
      );
    }
  }, []);

  const data = buildDashboardData(analysis);

  const hasData =
    data.total > 0;

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <header style={styles.header}>
          <div>
            <div style={styles.badge}>
              ● AUDIENCEPULSE AI
            </div>

            <h1 style={styles.title}>
              Audience Intelligence
            </h1>

            <p style={styles.subtitle}>
              Understand what your audience is saying
              and discover what to create next.
            </p>
          </div>

          <button
            style={styles.backButton}
            onClick={() => {
              window.location.href = "/";
            }}
          >
            ← Analyze another video
          </button>
        </header>

        {/* Empty State */}
        {!hasData && (
          <section style={styles.emptyCard}>
            <div style={styles.emptyIcon}>
              📊
            </div>

            <h2 style={styles.emptyTitle}>
              No audience data available
            </h2>

            <p style={styles.emptyText}>
              Upload a CSV containing YouTube comments
              or analyze a video first.
            </p>

            <button
              style={styles.primaryButton}
              onClick={() => {
                window.location.href = "/";
              }}
            >
              Start Analysis
            </button>
          </section>
        )}

        {/* Stats */}
        {hasData && (
          <>
            <section style={styles.statsGrid}>
              <StatCard
                title="Comments Analyzed"
                value={data.total.toLocaleString()}
                icon="💬"
              />

              <StatCard
                title="Positive"
                value={`${data.positive}%`}
                icon="😊"
              />

              <StatCard
                title="Neutral"
                value={`${data.neutral}%`}
                icon="😐"
              />

              <StatCard
                title="Negative"
                value={`${data.negative}%`}
                icon="☹️"
              />
            </section>

            {/* Sentiment */}
            <section style={styles.card}>
              <SectionTitle
                title="Sentiment Analysis"
                subtitle="Overall audience reaction"
              />

              <div style={styles.sentimentGrid}>
                <div style={styles.sentimentCard}>
                  <span>😊 Positive</span>
                  <strong>
                    {data.positive}%
                  </strong>
                  <ProgressBar
                    label=""
                    value={data.positive}
                  />
                </div>

                <div style={styles.sentimentCard}>
                  <span>😐 Neutral</span>
                  <strong>
                    {data.neutral}%
                  </strong>
                  <ProgressBar
                    label=""
                    value={data.neutral}
                  />
                </div>

                <div style={styles.sentimentCard}>
                  <span>☹️ Negative</span>
                  <strong>
                    {data.negative}%
                  </strong>
                  <ProgressBar
                    label=""
                    value={data.negative}
                  />
                </div>
              </div>
            </section>

            {/* Language + Topics */}
            <section style={styles.twoColumn}>

              <div style={styles.card}>
                <SectionTitle
                  title="Language Signals"
                  subtitle="Languages detected in your audience"
                />

                {data.languages.length > 0 ? (
                  data.languages.map(
                    ([language, value]) => (
                      <ProgressBar
                        key={language}
                        label={language}
                        value={value}
                      />
                    )
                  )
                ) : (
                  <p style={styles.emptyText}>
                    No language data available.
                  </p>
                )}
              </div>

              <div style={styles.card}>
                <SectionTitle
                  title="Trending Topics & Demand"
                  subtitle="Topics your audience appears to care about"
                />

                <div style={styles.topicGrid}>
                  {data.topics.map(
                    ([topic, score], index) => (
                      <div
                        key={topic}
                        style={styles.topicItem}
                      >
                        <div style={styles.topicLeft}>
                          <div style={styles.rank}>
                            {index + 1}
                          </div>

                          <div style={styles.topicName}>
                            {topic}
                          </div>
                        </div>

                        <div style={styles.score}>
                          {score}/100
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

            </section>
          </>
        )}
      </div>
    </main>
  );
}
// ================================
// Part 3/3 — Styles
// ================================

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    color: "#0f172a",
    padding: "32px 16px 60px",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  },

  container: {
    width: "100%",
    maxWidth: 1120,
    margin: "0 auto",
  },

  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 20,
    marginBottom: 30,
    flexWrap: "wrap",
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    color: "#6d28d9",
    background: "#ede9fe",
    borderRadius: 999,
    padding: "7px 12px",
    fontSize: 11,
    fontWeight: 900,
  },

  title: {
    margin: "12px 0 0",
    fontSize: "clamp(30px, 6vw, 48px)",
    lineHeight: 1.1,
    fontWeight: 900,
    letterSpacing: "-1.5px",
  },

  subtitle: {
    margin: "9px 0 0",
    color: "#64748b",
    fontSize: 14,
    lineHeight: 1.6,
    maxWidth: 650,
  },

  backButton: {
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#0f172a",
    borderRadius: 11,
    padding: "10px 14px",
    fontSize: 12,
    fontWeight: 800,
    cursor: "pointer",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 13,
    marginBottom: 18,
  },

  statCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 17,
    padding: 18,
    display: "flex",
    alignItems: "center",
    gap: 13,
    boxShadow:
      "0 8px 25px rgba(15,23,42,.04)",
  },

  statIcon: {
    width: 43,
    height: 43,
    borderRadius: 12,
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
  },

  statTitle: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: 700,
  },

  statValue: {
    marginTop: 4,
    fontSize: 22,
    fontWeight: 900,
  },

  card: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 18,
    padding: 20,
    boxShadow:
      "0 8px 25px rgba(15,23,42,.04)",
  },

  sectionTitle: {
    marginBottom: 18,
  },

  sectionHeading: {
    margin: 0,
    fontSize: 18,
    fontWeight: 900,
  },

  sectionSubtitle: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: 12,
  },

  sentimentGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 12,
  },

  sentimentCard: {
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    padding: 15,
    display: "flex",
    flexDirection: "column",
    gap: 9,
  },

  twoColumn: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 18,
    marginTop: 18,
  },

  progressRow: {
    marginBottom: 15,
  },

  progressHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    fontSize: 12,
    color: "#475569",
    marginBottom: 7,
  },

  progressTrack: {
    width: "100%",
    height: 9,
    borderRadius: 999,
    background: "#e2e8f0",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
    background: "#0f172a",
    transition: "width .3s ease",
  },

  topicGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 10,
  },

  topicItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    padding: 13,
  },

  topicLeft: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    minWidth: 0,
  },

  rank: {
    width: 31,
    height: 31,
    borderRadius: 9,
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 900,
    flexShrink: 0,
  },

  topicName: {
    fontSize: 13,
    fontWeight: 700,
  },

  score: {
    background: "#0f172a",
    color: "#ffffff",
    padding: "6px 9px",
    borderRadius: 999,
    fontSize: 10,
    fontWeight: 800,
    whiteSpace: "nowrap",
  },

  emptyCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 20,
    padding: "45px 20px",
    textAlign: "center",
  },

  emptyIcon: {
    fontSize: 38,
    marginBottom: 10,
  },

  emptyTitle: {
    margin: 0,
    fontSize: 21,
    fontWeight: 900,
  },

  emptyText: {
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 1.6,
  },

  primaryButton: {
    border: "none",
    borderRadius: 12,
    background: "#0f172a",
    color: "#ffffff",
    padding: "12px 18px",
    fontSize: 13,
    fontWeight: 800,
    cursor: "pointer",
  },
};