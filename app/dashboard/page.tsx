"use client";

import { useMemo } from "react";

type CommentItem = {
  text: string;
  author: string;
};

type AnalysisData = {
  source?: string;
  commentsAnalyzed?: number;
  sentiment?: {
    positive?: number;
    neutral?: number;
    negative?: number;
  };
  comments?: string[] | CommentItem[];
};

type DashboardData = {
  total: number;
  positive: number;
  neutral: number;
  negative: number;
  comments: CommentItem[];
  topics: [string, number][];
  questions: [string, number][];
  languages: [string, number][];
  recommendations: {
    title: string;
    score: number;
    reason: string;
  }[];
};

function normalizeComments(
  comments: string[] | CommentItem[] | undefined
): CommentItem[] {
  if (!Array.isArray(comments)) {
    return [];
  }

  return comments
    .map((comment, index) => {
      if (typeof comment === "string") {
        return {
          text: comment,
          author: "Viewer",
        };
      }

      return {
        text: comment.text || "",
        author: comment.author || `Viewer ${index + 1}`,
      };
    })
    .filter((comment) => comment.text.trim().length > 0);
}

function containsAny(text: string, words: string[]) {
  const lower = text.toLowerCase();

  return words.some((word) =>
    lower.includes(word.toLowerCase())
  );
}

function buildDashboardData(
  analysis: AnalysisData
): DashboardData {
  const comments = normalizeComments(analysis.comments);

  const total =
    analysis.commentsAnalyzed || comments.length;

  const positive = analysis.sentiment?.positive ?? 0;
  const neutral = analysis.sentiment?.neutral ?? 0;
  const negative = analysis.sentiment?.negative ?? 0;

  const topicWords: Record<string, string[]> = {
    Investing: [
      "invest",
      "investment",
      "investing",
      "முதலீடு",
      "निवेश",
    ],
    "Mutual Funds": [
      "mutual fund",
      "mutual funds",
      "mf",
      "மியூச்சுவல்",
      "म्यूचुअल",
    ],
    Savings: [
      "save",
      "saving",
      "savings",
      "சேமிப்பு",
      "बचत",
    ],
    Budgeting: [
      "budget",
      "budgeting",
      "செலவு",
      "பட்ஜெட்",
      "बजट",
    ],
    "Personal Finance": [
      "finance",
      "financial",
      "money",
      "salary",
      "பணம்",
      "நிதி",
      "पैसा",
    ],
  };

  const topicCounts: Record<string, number> = {};

  for (const [topic, words] of Object.entries(topicWords)) {
    const count = comments.filter((comment) =>
      containsAny(comment.text, words)
    ).length;

    if (count > 0) {
      topicCounts[topic] = count;
    }
  }

  const topics: [string, number][] = Object.entries(
    topicCounts
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([topic, count]) => [
      topic,
      Math.min(
        99,
        Math.max(
          55,
          Math.round((count / Math.max(1, total)) * 100) +
            45
        )
      ),
    ]);

  const questionComments = comments.filter((comment) => {
    const text = comment.text.trim().toLowerCase();

    return (
      text.includes("?") ||
      text.startsWith("how ") ||
      text.startsWith("what ") ||
      text.startsWith("which ") ||
      text.startsWith("when ") ||
      text.startsWith("why ") ||
      text.includes("எப்படி") ||
      text.includes("என்ன") ||
      text.includes("எது") ||
      text.includes("எப்போது") ||
      text.includes("कैसे") ||
      text.includes("क्या")
    );
  });

  const questionMap = new Map<string, number>();

  for (const comment of questionComments) {
    const cleanQuestion = comment.text
      .replace(/\s+/g, " ")
      .trim();

    if (cleanQuestion.length >= 8) {
      questionMap.set(
        cleanQuestion,
        (questionMap.get(cleanQuestion) || 0) + 1
      );
    }
  }

  const questions: [string, number][] = Array.from(
    questionMap.entries()
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const tamilHits = comments.filter((comment) =>
    /[\u0B80-\u0BFF]/.test(comment.text)
  ).length;

  const hindiHits = comments.filter((comment) =>
    /[\u0900-\u097F]/.test(comment.text)
  ).length;

  const englishHits = comments.filter((comment) =>
    /[a-zA-Z]/.test(comment.text)
  ).length;

  const languageTotal =
    tamilHits + hindiHits + englishHits;

  const languages: [string, number][] =
    languageTotal > 0
      ? [
          [
            "Tamil",
            Math.round(
              (tamilHits / languageTotal) * 100
            ),
          ],
          [
            "Hindi",
            Math.round(
              (hindiHits / languageTotal) * 100
            ),
          ],
          [
            "English",
            Math.round(
              (englishHits / languageTotal) * 100
            ),
          ],
        ]
          .filter((item) => item[1] > 0)
          .sort((a, b) => b[1] - a[1])
      : [];

  const recommendations = [
    {
      title: "Create a follow-up video",
      score: Math.min(
        98,
        70 + Math.round(positive / 5)
      ),
      reason:
        "Build on the strongest positive audience response and answer the most common questions.",
    },
    {
      title: "Answer repeated audience questions",
      score: Math.min(
        95,
        65 + questions.length * 5
      ),
      reason:
        "Turn recurring viewer questions into a focused educational video.",
    },
    {
      title: "Create a beginner-friendly guide",
      score: Math.min(
        92,
        60 + topics.length * 5
      ),
      reason:
        "Use the strongest audience topics to create simple, practical content.",
    },
  ];

  return {
    total,
    positive,
    neutral,
    negative,
    comments,
    topics,
    questions,
    languages,
    recommendations,
  };
}

export default function DashboardPage() {
  const analysis: AnalysisData = {
    commentsAnalyzed: 0,
    sentiment: {
      positive: 0,
      neutral: 100,
      negative: 0,
    },
    comments: [],
  };

  const data = useMemo(
    () => buildDashboardData(analysis),
    [analysis.comments, analysis.commentsAnalyzed]
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        color: "#0f172a",
        fontFamily:
          "Arial, Helvetica, sans-serif",
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <header
          style={{
            marginBottom: 24,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 32,
              fontWeight: 800,
            }}
          >
            Audience Intelligence
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              color: "#64748b",
              fontSize: 14,
            }}
          >
            AudiencePulse AI dashboard
          </p>
        </header>
<section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 14,
            marginBottom: 20,
          }}
        >
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

        <section style={styles.card}>
          <SectionTitle
            title="Sentiment Analysis"
            subtitle="Overall emotional signal from the comments"
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
            }}
          >
            <SentimentBar
              label="Positive"
              value={data.positive}
              icon="😊"
            />

            <SentimentBar
              label="Neutral"
              value={data.neutral}
              icon="😐"
            />

            <SentimentBar
              label="Negative"
              value={data.negative}
              icon="☹️"
            />
          </div>

          <p style={styles.note}>
            Based on audience comments processed by
            AudiencePulse AI.
          </p>
        </section>

        <section style={styles.card}>
          <SectionTitle
            title="Top Audience Topics"
            subtitle="Topics appearing most frequently in comments"
          />

          {data.topics.length === 0 ? (
            <p style={styles.emptyText}>
              No topics detected yet.
            </p>
          ) : (
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
          )}
        </section>

        <section style={styles.card}>
          <SectionTitle
            title="Audience Questions"
            subtitle="Questions your viewers are asking"
          />

          {data.questions.length === 0 ? (
            <p style={styles.emptyText}>
              No questions detected.
            </p>
          ) : (
            <div>
              {data.questions.map(
                ([question, count], index) => (
                  <div
                    key={`${question}-${index}`}
                    style={styles.questionItem}
                  >
                    <div style={styles.questionNumber}>
                      {index + 1}
                    </div>

                    <div
                      style={styles.questionContent}
                    >
                      <p style={styles.questionText}>
                        {question}
                      </p>

                      <p
                        style={styles.questionCount}
                      >
                        Asked {count}{" "}
                        {count === 1
                          ? "time"
                          : "times"}
                      </p>
                    </div>

                    <span
                      style={styles.opportunity}
                    >
                      Opportunity
                    </span>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        <section style={styles.card}>
          <SectionTitle
            title="Language Signals"
            subtitle="Languages detected in your audience"
          />

          {data.languages.length === 0 ? (
            <p style={styles.emptyText}>
              No language data available.
            </p>
          ) : (
            <div>
              {data.languages.map(
                ([language, percentage]) => (
                  <div
                    key={language}
                    style={{
                      marginBottom: 15,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        marginBottom: 6,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      <span>{language}</span>
                      <span>
                        {percentage}%
                      </span>
                    </div>

                    <div
                      style={{
                        height: 7,
                        background: "#e2e8f0",
                        borderRadius: 999,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${percentage}%`,
                          height: "100%",
                          background: "#0f172a",
                          borderRadius: 999,
                        }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        <section
          style={{
            ...styles.darkCard,
            marginBottom: 20,
          }}
        >
          <SectionTitle
            title="Next Video Opportunities"
            subtitle="Content ideas generated from audience demand"
            dark
          />

          {data.recommendations.length === 0 ? (
            <p style={styles.darkEmptyText}>
              Not enough audience data to generate
              recommendations.
            </p>
          ) : (
            <div style={styles.recommendGrid}>
              {data.recommendations.map(
                (recommendation, index) => (
                  <div
                    key={recommendation.title}
                    style={styles.recommendCard}
                  >
                    <div
                      style={styles.recommendTop}
                    >
                      <span style={styles.number}>
                        #{index + 1}
                      </span>

                      <span
                        style={
                          styles.recommendScore
                        }
                      >
                        {recommendation.score}/100
                      </span>
                    </div>

                    <h3
                      style={
                        styles.recommendTitle
                      }
                    >
                      {recommendation.title}
                    </h3>

                    <p
                      style={
                        styles.recommendReason
                      }
                    >
                      {recommendation.reason}
                    </p>

                    <button
                      type="button"
                      style={styles.planButton}
                      onClick={() => {
                        alert(
                          `Content idea selected: ${recommendation.title}`
                        );
                      }}
                    >
                      Plan This Video
                    </button>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        <section style={styles.card}>
          <SectionTitle
            title="Audience Action Plan"
            subtitle="Simple next steps based on the analysis"
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            <ActionCard
              number="1"
              text={
                data.topics.length > 0
                  ? `Focus your next video on ${data.topics[0][0]}.`
                  : "Focus your next video on the highest demand topic."
              }
            />

            <ActionCard
              number="2"
              text={
                data.questions.length > 0
                  ? "Answer the repeated audience questions directly in your content."
                  : "Answer repeated audience questions directly in your content."
              }
            />

            <ActionCard
              number="3"
              text={
                data.languages.length > 0
                  ? `Use ${data.languages[0][0]} audience language signals to improve titles and descriptions.`
                  : "Use audience language signals to improve titles and descriptions."
              }
            />
          </div>
        </section>

        <section style={styles.card}>
          <SectionTitle
            title="Sample Audience Comments"
            subtitle="Comments used for this analysis"
          />

          {data.comments.length === 0 ? (
            <p style={styles.emptyText}>
              No audience comments available.
            </p>
          ) : (
            <div>
              {data.comments
                .slice(0, 30)
                .map((comment, index) => (
                  <div
                    key={`${comment.text}-${index}`}
                    style={styles.commentItem}
                  >
                    <div
                      style={styles.commentAvatar}
                    >
                      {comment.author
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div
                      style={{
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={styles.commentAuthor}
                      >
                        {comment.author}
                      </div>

                      <p
                        style={styles.commentText}
                      >
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>
<footer
          style={{
            textAlign: "center",
            color: "#94a3b8",
            fontSize: 11,
            padding: "10px 0 30px",
          }}
        >
          AudiencePulse AI • POC
        </footer>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: string;
}) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statIcon}>{icon}</div>

      <div>
        <div style={styles.statValue}>{value}</div>

        <div style={styles.statTitle}>{title}</div>
      </div>
    </div>
  );
}

function SentimentBar({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: string;
}) {
  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 14,
        padding: 15,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 800,
          }}
        >
          {icon} {label}
        </span>

        <span
          style={{
            fontSize: 13,
            fontWeight: 900,
          }}
        >
          {value}%
        </span>
      </div>

      <div
        style={{
          height: 8,
          background: "#e2e8f0",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${Math.max(
              0,
              Math.min(100, value)
            )}%`,
            height: "100%",
            background: "#0f172a",
            borderRadius: 999,
          }}
        />
      </div>
    </div>
  );
}

function SectionTitle({
  title,
  subtitle,
  dark = false,
}: {
  title: string;
  subtitle: string;
  dark?: boolean;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h2
        style={{
          margin: 0,
          fontSize: 18,
          fontWeight: 800,
          color: dark ? "#ffffff" : "#0f172a",
        }}
      >
        {title}
      </h2>

      <p
        style={{
          margin: "5px 0 0",
          fontSize: 11,
          color: dark ? "#94a3b8" : "#64748b",
        }}
      >
        {subtitle}
      </p>
    </div>
  );
}

function ActionCard({
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

      <p style={styles.actionText}>{text}</p>
    </div>
  );
}

const styles: Record<
  string,
  React.CSSProperties
> = {
  card: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },

  darkCard: {
    background: "#0f172a",
    borderRadius: 16,
    padding: 18,
  },

  statCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    padding: 17,
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  statIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 19,
    flexShrink: 0,
  },

  statValue: {
    fontSize: 22,
    fontWeight: 900,
    lineHeight: 1.1,
  },

  statTitle: {
    marginTop: 5,
    color: "#64748b",
    fontSize: 11,
    fontWeight: 700,
  },

  note: {
    margin: "12px 0 0",
    color: "#94a3b8",
    fontSize: 10,
  },

  topicGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 11,
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
    fontSize: 14,
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

  questionItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexWrap: "wrap",
  },

  questionNumber: {
    width: 30,
    height: 30,
    borderRadius: 9,
    background: "#0f172a",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 900,
    flexShrink: 0,
  },

  questionContent: {
    flex: 1,
    minWidth: 0,
  },

  questionText: {
    margin: 0,
    fontSize: 14,
    lineHeight: 1.5,
    fontWeight: 700,
  },

  questionCount: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: 11,
  },

  opportunity: {
    background: "#fef3c7",
    color: "#92400e",
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 10,
    fontWeight: 800,
  },

  recommendGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 13,
  },

  recommendCard: {
    background: "rgba(255,255,255,.07)",
    border:
      "1px solid rgba(255,255,255,.1)",
    borderRadius: 16,
    padding: 17,
  },

  recommendTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  number: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: 800,
  },

  recommendScore: {
    background: "#ffffff",
    color: "#0f172a",
    padding: "6px 9px",
    borderRadius: 999,
    fontSize: 10,
    fontWeight: 900,
  },

  recommendTitle: {
    margin: "17px 0 8px",
    fontSize: 17,
    lineHeight: 1.35,
    fontWeight: 800,
    color: "#ffffff",
  },

  recommendReason: {
    margin: 0,
    color: "#cbd5e1",
    fontSize: 12,
    lineHeight: 1.6,
  },

  planButton: {
    width: "100%",
    marginTop: 15,
    border:
      "1px solid rgba(255,255,255,.15)",
    borderRadius: 10,
    background: "#ffffff",
    color: "#0f172a",
    padding: "10px 12px",
    fontSize: 12,
    fontWeight: 800,
    cursor: "pointer",
  },

  darkEmptyText: {
    color: "#cbd5e1",
    fontSize: 13,
  },

  actionCard: {
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    padding: 15,
  },

  actionNumber: {
    width: 30,
    height: 30,
    borderRadius: 9,
    background: "#0f172a",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
    fontSize: 12,
  },

  actionText: {
    margin: "12px 0 0",
    color: "#475569",
    fontSize: 13,
    lineHeight: 1.55,
  },

  commentItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    borderBottom: "1px solid #f1f5f9",
    padding: "13px 0",
  },

  commentAvatar: {
    width: 34,
    height: 34,
    minWidth: 34,
    borderRadius: "50%",
    background: "#e2e8f0",
    color: "#334155",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 900,
  },

  commentAuthor: {
    fontSize: 12,
    color: "#334155",
    fontWeight: 800,
  },

  commentText: {
    margin: "4px 0 0",
    color: "#475569",
    fontSize: 13,
    lineHeight: 1.5,
  },

  emptyText: {
    color: "#94a3b8",
    fontSize: 13,
  },
};