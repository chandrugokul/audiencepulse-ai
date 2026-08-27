"use client";

import { useEffect, useState } from "react";

type CommentItem = {
  text?: string;
  comment?: string;
  author?: string;
  authorName?: string;
};

type Recommendation = {
  number: number;
  title: string;
  reason: string;
  score: number;
};

type DashboardData = {
  comments: CommentItem[];
  commentsAnalyzed: number;
  sentimentScore: number;
  sentiment: string;
  topics: [string, number][];
  questions: [string, number][];
  languages: [string, number][];
  recommendations: Recommendation[];
};

function FeatureCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statTitle}>{title}</div>
      <div style={styles.statValue}>{value}</div>
      <div style={styles.statDescription}>
        {description}
      </div>
    </div>
  );
}

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div style={styles.sectionHeader}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      <p style={styles.sectionSubtitle}>{subtitle}</p>
    </div>
  );
}

function buildDashboardData(
  analysis: any
): DashboardData {
  const comments: CommentItem[] =
    Array.isArray(analysis?.comments)
      ? analysis.comments
      : [];

  const commentsAnalyzed =
    Number(
      analysis?.commentsAnalyzed
    ) || comments.length;

  const rawScore =
    Number(
      analysis?.sentimentScore
    );

  const sentimentScore = Number.isFinite(rawScore)
    ? Math.max(0, Math.min(100, rawScore))
    : 50;

  const sentiment =
    typeof analysis?.sentiment === "string"
      ? analysis.sentiment
      : sentimentScore >= 60
        ? "Positive"
        : sentimentScore <= 40
          ? "Negative"
          : "Neutral";

  const topics: [string, number][] =
    Array.isArray(analysis?.topics)
      ? analysis.topics
          .filter(
            (item: any) =>
              Array.isArray(item) &&
              item.length >= 2
          )
          .map(
            (item: any) =>
              [
                String(item[0]),
                Number(item[1]) || 0,
              ] as [string, number]
          )
          .slice(0, 12)
      : [];

  const questions: [string, number][] =
    Array.isArray(analysis?.questions)
      ? analysis.questions
          .filter(
            (item: any) =>
              Array.isArray(item) &&
              item.length >= 2
          )
          .map(
            (item: any) =>
              [
                String(item[0]),
                Number(item[1]) || 0,
              ] as [string, number]
          )
          .slice(0, 12)
      : [];

  const languages: [string, number][] =
    Array.isArray(analysis?.languages)
      ? analysis.languages
          .filter(
            (item: any) =>
              Array.isArray(item) &&
              item.length >= 2
          )
          .map(
            (item: any) =>
              [
                String(item[0]),
                Number(item[1]) || 0,
              ] as [string, number]
          )
          .slice(0, 10)
      : [];

  const recommendations: Recommendation[] =
    Array.isArray(analysis?.recommendations)
      ? analysis.recommendations
          .map((item: any, index: number) => ({
            number:
              Number(item?.number) || index + 1,
            title:
              String(
                item?.title ||
                  item?.topic ||
                  "New content opportunity"
              ),
            reason:
              String(
                item?.reason ||
                  "Audience interest detected from comments."
              ),
            score:
              Math.max(
                0,
                Math.min(
                  100,
                  Number(item?.score) || 0
                )
              ),
          }))
          .slice(0, 6)
      : [];

  return {
    comments,
    commentsAnalyzed,
    sentimentScore,
    sentiment,
    topics,
    questions,
    languages,
    recommendations,
  };
}

export default function DashboardPage() {
  const [analysis, setAnalysis] =
    useState<any>(null);

  useEffect(() => {
    const stored =
      sessionStorage.getItem(
        "audiencepulse-analysis"
      );

    if (!stored) {
      return;
    }

    try {
      setAnalysis(JSON.parse(stored));
    } catch {
      setAnalysis(null);
    }
  }, []);

  if (!analysis) {
    return (
      <main style={styles.page}>
        <div style={styles.emptyPage}>
          <h1 style={styles.heroTitle}>
            AudiencePulse AI
          </h1>

          <p style={styles.sectionSubtitle}>
            No analysis data found.
          </p>

          <button
            type="button"
            onClick={() => {
              window.location.href = "/";
            }}
            style={styles.primaryButton}
          >
            Go Back
          </button>
        </div>
      </main>
    );
  }

  const data =
    buildDashboardData(analysis);

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        <header style={styles.header}>

          <button
            type="button"
            onClick={() => {
              window.location.href = "/";
            }}
            style={styles.backButton}
          >
            ← New Analysis
          </button>

          <div style={styles.badge}>
            ✨ Audience Intelligence
          </div>

          <h1 style={styles.heroTitle}>
            AudiencePulse AI
          </h1>

          <p style={styles.heroText}>
            Your audience intelligence dashboard
          </p>

        </header>

        {analysis?.video && (
          <section style={styles.videoCard}>

            {analysis.video.thumbnail && (
              <img
                src={analysis.video.thumbnail}
                alt={
                  analysis.video.title ||
                  "YouTube video"
                }
                style={styles.thumbnail}
              />
            )}

            <div style={styles.videoInfo}>

              <div style={styles.videoLabel}>
                YOUTUBE VIDEO
              </div>

              <h2 style={styles.videoTitle}>
                {analysis.video.title ||
                  "YouTube Video"}
              </h2>

              {analysis.video.channelTitle && (
                <p style={styles.videoChannel}>
                  {analysis.video.channelTitle}
                </p>
              )}

            </div>

          </section>
        )}

        <section style={styles.statsGrid}>

          <FeatureCard
            title="COMMENTS ANALYZED"
            value={String(
              data.commentsAnalyzed
            )}
            description="Audience comments processed"
          />

          <FeatureCard
            title="SENTIMENT"
            value={`${data.sentimentScore}%`}
            description={data.sentiment}
          />

          <FeatureCard
            title="TOP TOPICS"
            value={String(
              data.topics.length
            )}
            description="Audience discussion topics"
          />

          <FeatureCard
            title="QUESTIONS"
            value={String(
              data.questions.length
            )}
            description="Questions detected"
          />

        </section>

        <section style={styles.section}>

          <SectionTitle
            title="Audience Sentiment"
            subtitle="Overall emotional signal from the comments"
          />

          <div style={styles.sentimentCard}>

            <div style={styles.sentimentScore}>
              {data.sentimentScore}%
            </div>

            <div style={styles.sentimentContent}>

              <div style={styles.sentimentLabel}>
                {data.sentiment}
              </div>

              <div
                style={
                  styles.progressBackground
                }
              >
                <div
                  style={{
                    ...styles.progressBar,
                    width:
                      `${data.sentimentScore}%`,
                  }}
                />
              </div>

              <p style={styles.sentimentText}>
                Based on audience comments
                processed by AudiencePulse AI.
              </p>

            </div>

          </div>

        </section>

        <section style={styles.section}>

          <SectionTitle
            title="Top Audience Topics"
            subtitle="Topics appearing most frequently in comments"
          />

          {data.topics.length > 0 ? (
            <div style={styles.topicGrid}>

              {data.topics.map(
                ([topic, count], index) => (
                  <div
                    key={`${topic}-${index}`}
                    style={styles.topicItem}
                  >

                    <div style={styles.topicLeft}>

                      <div style={styles.rank}>
                        #{index + 1}
                      </div>

                      <div style={styles.topicName}>
                        {topic}
                      </div>

                    </div>

                    <div style={styles.score}>
                      {count} mentions
                    </div>

                  </div>
                )
              )}

            </div>
          ) : (
            <p style={styles.emptyText}>
              No topics detected yet.
            </p>
          )}

        </section>
        <section style={styles.section}>

          <SectionTitle
            title="Audience Questions"
            subtitle="Questions your viewers are asking"
          />

          {data.questions.length > 0 ? (
            <div>

              {data.questions.map(
                ([question, count], index) => (
                  <div
                    key={`${question}-${index}`}
                    style={styles.questionItem}
                  >

                    <div style={styles.questionContent}>

                      <p style={styles.questionText}>
                        {question}
                      </p>

                      <p style={styles.questionCount}>
                        {count} mention(s)
                      </p>

                    </div>

                    <div style={styles.opportunity}>
                      Content Opportunity
                    </div>

                  </div>
                )
              )}

            </div>
          ) : (
            <p style={styles.emptyText}>
              No questions detected.
            </p>
          )}

        </section>

        <section style={styles.section}>

          <SectionTitle
            title="Language Signals"
            subtitle="Languages detected in your audience"
          />

          {data.languages.length > 0 ? (
            <div style={styles.languageGrid}>

              {data.languages.map(
                ([language, count]) => (
                  <div
                    key={language}
                    style={styles.languageCard}
                  >

                    <div style={styles.languageName}>
                      {language}
                    </div>

                    <div style={styles.languageCount}>
                      {count} comments
                    </div>

                  </div>
                )
              )}

            </div>
          ) : (
            <p style={styles.emptyText}>
              No language data available.
            </p>
          )}

        </section>

        <section style={styles.darkSection}>

          <SectionTitle
            title="Next Video Opportunities"
            subtitle="Content ideas generated from audience demand"
          />

          {data.recommendations.length > 0 ? (
            <div style={styles.recommendGrid}>

              {data.recommendations.map(
                (item) => (
                  <div
                    key={`${item.number}-${item.title}`}
                    style={styles.recommendCard}
                  >

                    <div style={styles.recommendTop}>

                      <span style={styles.number}>
                        #{item.number}
                      </span>

                      <span
                        style={
                          styles.recommendScore
                        }
                      >
                        {item.score}% demand
                      </span>

                    </div>

                    <h3
                      style={
                        styles.recommendTitle
                      }
                    >
                      {item.title}
                    </h3>

                    <p
                      style={
                        styles.recommendReason
                      }
                    >
                      {item.reason}
                    </p>

                    <button
                      type="button"
                      style={styles.planButton}
                      onClick={() => {
                        alert(
                          `Content idea: ${item.title}`
                        );
                      }}
                    >
                      Plan This Video
                    </button>

                  </div>
                )
              )}

            </div>
          ) : (
            <p style={styles.darkEmptyText}>
              Not enough audience data to generate
              recommendations.
            </p>
          )}

        </section>

        <section style={styles.section}>

          <SectionTitle
            title="Audience Action Plan"
            subtitle="Simple next steps based on the analysis"
          />

          <div style={styles.actionGrid}>

            <div style={styles.actionCard}>
              <div style={styles.actionNumber}>
                1
              </div>

              <p style={styles.actionText}>
                Focus your next video on the highest
                demand topic.
              </p>
            </div>

            <div style={styles.actionCard}>
              <div style={styles.actionNumber}>
                2
              </div>

              <p style={styles.actionText}>
                Answer repeated audience questions
                directly in your content.
              </p>
            </div>

            <div style={styles.actionCard}>
              <div style={styles.actionNumber}>
                3
              </div>

              <p style={styles.actionText}>
                Use audience language signals to
                improve titles and descriptions.
              </p>
            </div>

          </div>

        </section>

        <section style={styles.section}>

          <SectionTitle
            title="Sample Audience Comments"
            subtitle="Comments used for this analysis"
          />

          {data.comments.length > 0 ? (
            <div>

              {data.comments
                .slice(0, 20)
                .map(
                  (comment, index) => {

                    const text =
                      comment?.text ||
                      comment?.comment ||
                      "";

                    const author =
                      comment?.author ||
                      comment?.authorName ||
                      "Viewer";

                    return (
                      <div
                        key={index}
                        style={styles.commentItem}
                      >

                        <div
                          style={
                            styles.commentAvatar
                          }
                        >
                          {String(author)
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>

                          <strong
                            style={
                              styles.commentAuthor
                            }
                          >
                            {author}
                          </strong>

                          <p
                            style={
                              styles.commentText
                            }
                          >
                            {text}
                          </p>

                        </div>

                      </div>
                    );
                  }
                )}

            </div>
          ) : (
            <p style={styles.emptyText}>
              No comments available.
            </p>
          )}

        </section>

        <footer style={styles.footer}>
          AudiencePulse AI • POC
        </footer>

      </div>
    </main>
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
    padding: "28px 16px 60px",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  },

  container: {
    width: "100%",
    maxWidth: 1120,
    margin: "0 auto",
  },

  header: {
    textAlign: "center",
    marginBottom: 30,
  },

  backButton: {
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#334155",
    borderRadius: 10,
    padding: "9px 13px",
    fontSize: 12,
    fontWeight: 800,
    cursor: "pointer",
    marginBottom: 18,
  },

  badge: {
    display: "inline-flex",
    background: "#ede9fe",
    color: "#6d28d9",
    borderRadius: 999,
    padding: "7px 13px",
    fontSize: 11,
    fontWeight: 800,
  },

  heroTitle: {
    fontSize: "clamp(32px, 7vw, 54px)",
    lineHeight: 1.05,
    margin: "15px 0 0",
    fontWeight: 900,
    letterSpacing: "-2px",
  },

  heroText: {
    color: "#64748b",
    fontSize: 15,
    margin: "10px 0 0",
  },

  videoCard: {
    display: "flex",
    gap: 18,
    alignItems: "center",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 20,
    padding: 15,
    marginBottom: 18,
    flexWrap: "wrap",
  },

  thumbnail: {
    width: 230,
    maxWidth: "100%",
    aspectRatio: "16 / 9",
    objectFit: "cover",
    borderRadius: 14,
  },

  videoInfo: {
    flex: 1,
    minWidth: 220,
  },

  videoLabel: {
    fontSize: 10,
    fontWeight: 900,
    color: "#64748b",
    letterSpacing: 1,
  },

  videoTitle: {
    margin: "7px 0 0",
    fontSize: 20,
    lineHeight: 1.35,
    fontWeight: 850,
  },

  videoChannel: {
    margin: "7px 0 0",
    color: "#64748b",
    fontSize: 13,
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 13,
  },

  statCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 18,
    padding: 18,
  },

  statTitle: {
    color: "#64748b",
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: ".5px",
  },

  statValue: {
    fontSize: 30,
    fontWeight: 900,
    marginTop: 8,
  },

  statDescription: {
    color: "#94a3b8",
    fontSize: 11,
    marginTop: 4,
  },

  section: {
    marginTop: 35,
  },

  sectionHeader: {
    marginBottom: 15,
  },

  sectionTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 850,
  },

  sectionSubtitle: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: 13,
    lineHeight: 1.5,
  },

  sentimentCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 18,
    padding: 20,
    display: "flex",
    alignItems: "center",
    gap: 20,
  },

  sentimentScore: {
    fontSize: 38,
    fontWeight: 900,
    minWidth: 105,
  },

  sentimentContent: {
    flex: 1,
  },

  sentimentLabel: {
    fontSize: 14,
    fontWeight: 850,
    marginBottom: 8,
  },

  progressBackground: {
    height: 10,
    background: "#e2e8f0",
    borderRadius: 999,
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    background: "#0f172a",
    borderRadius: 999,
  },

  sentimentText: {
    color: "#64748b",
    fontSize: 12,
    margin: "9px 0 0",
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
    background: "#ffffff",
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
    fontSize: 11,
    fontWeight: 900,
    flexShrink: 0,
  },

  topicName: {
    fontSize: 14,
    fontWeight: 700,
    overflow: "hidden",
    textOverflow: "ellipsis",
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
    gap: 14,
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    padding: 15,
    marginBottom: 10,
    background: "#ffffff",
    flexWrap: "wrap",
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

  languageGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 12,
  },

  languageCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 15,
    padding: 17,
  },

  languageName: {
    fontSize: 16,
    fontWeight: 850,
  },

  languageCount: {
    marginTop: 6,
    color: "#64748b",
    fontSize: 12,
  },

  darkSection: {
    marginTop: 35,
    background: "#0f172a",
    color: "#ffffff",
    borderRadius: 22,
    padding: "24px 20px",
  },

  recommendGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 13,
  },

  recommendCard: {
    background: "rgba(255,255,255,.07)",
    border: "1px solid rgba(255,255,255,.1)",
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
    border: "1px solid rgba(255,255,255,.15)",
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
  }

// Part 3/3 — paste this after Part 2

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    color: "#0f172a",
    padding: "28px 16px 60px",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  },

  container: {
    width: "100%",
    maxWidth: 1180,
    margin: "0 auto",
  },

  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 24,
    flexWrap: "wrap",
  },

  backButton: {
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    color: "#334155",
    borderRadius: 10,
    padding: "9px 13px",
    fontSize: 13,
    fontWeight: 800,
    cursor: "pointer",
  },

  sourceBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    background: "#ede9fe",
    color: "#6d28d9",
    borderRadius: 999,
    padding: "8px 13px",
    fontSize: 11,
    fontWeight: 800,
  },

  hero: {
    background: "#0f172a",
    color: "#ffffff",
    borderRadius: 24,
    padding: "26px",
    marginBottom: 18,
  },

  heroTitle: {
    margin: 0,
    fontSize: "clamp(25px, 5vw, 38px)",
    fontWeight: 900,
    letterSpacing: "-1px",
  },

  heroText: {
    margin: "8px 0 0",
    color: "#cbd5e1",
    fontSize: 14,
    lineHeight: 1.6,
  },

  videoCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
  },

  videoLayout: {
    display: "grid",
    gridTemplateColumns: "minmax(240px, 340px) 1fr",
    gap: 18,
    alignItems: "center",
  },

  thumbnail: {
    width: "100%",
    display: "block",
    borderRadius: 14,
    aspectRatio: "16 / 9",
    objectFit: "cover",
  },

  videoTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 850,
  },

  videoMeta: {
    marginTop: 8,
    color: "#64748b",
    fontSize: 13,
    lineHeight: 1.6,
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 12,
    marginBottom: 18,
  },

  statCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    padding: 18,
  },

  statLabel: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: ".5px",
  },

  statValue: {
    marginTop: 7,
    fontSize: 27,
    fontWeight: 900,
  },

  section: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
  },

  sectionTitle: {
    margin: 0,
    fontSize: 19,
    fontWeight: 850,
  },

  sectionSubtitle: {
    margin: "5px 0 16px",
    color: "#64748b",
    fontSize: 12,
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
    gap: 14,
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    padding: 15,
    marginBottom: 10,
    flexWrap: "wrap",
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

  recommendSection: {
    background: "#0f172a",
    color: "#ffffff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
  },

  recommendGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 13,
  },

  recommendCard: {
    background: "rgba(255,255,255,.07)",
    border: "1px solid rgba(255,255,255,.1)",
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
    border: "1px solid rgba(255,255,255,.15)",
    borderRadius: 10,
    background: "#ffffff",
    color: "#0f172a",
    padding: "10px 12px",
    fontSize: 12,
    fontWeight: 800,
    cursor: "pointer",
  },

  actionGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(210px, 1fr))",
    gap: 12,
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

  footer: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 11,
    paddingTop: 12,
  },
};