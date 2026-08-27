"use client";

import { useEffect, useState } from "react";
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

type CommentItem = { text: string; author?: string };
type ScorePair = [string, number];
type AnalysisData = {
  source?: string;
  video?: { id?: string; title?: string; channelTitle?: string; thumbnail?: string };
  commentsAnalyzed?: number;
  comments?: CommentItem[];
};
type DashboardData = {
  comments: number;
  positive: number;
  neutral: number;
  negative: number;
  languages: ScorePair[];
  countries: ScorePair[];
  topics: ScorePair[];
  questions: ScorePair[];
  recommendations: { title: string; score: number; reason: string }[];
};

export default function DashboardPage() {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("audiencepulse-analysis");
    if (!stored) return;
    try { setAnalysis(JSON.parse(stored) as AnalysisData); }
    catch { setAnalysis(null); }
  }, []);

  const data = buildDashboardData(analysis);

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <button type="button" onClick={() => { window.location.href = "/"; }} style={styles.backButton}>
          <ArrowLeft size={17} /> Analyze another video
        </button>

        <header style={styles.header}>
          <div>
            <div style={styles.badge}><Sparkles size={13} /> REAL ANALYSIS</div>
            <h1 style={styles.title}>Audience Intelligence</h1>
            <p style={styles.subtitle}>{analysis?.video?.title || "YouTube audience analysis"}</p>
          </div>
          <div style={styles.sourceBox}>Source: <strong>{analysis?.source === "csv" ? "CSV" : "YouTube"}</strong></div>
        </header>

        {analysis?.video && (
          <section style={styles.videoCard}>
            {analysis.video.thumbnail && <img src={analysis.video.thumbnail} alt="YouTube thumbnail" style={styles.thumbnail} />}
            <div style={styles.videoInfo}>
              <h2 style={styles.videoTitle}>{analysis.video.title || "YouTube Video"}</h2>
              {analysis.video.channelTitle && <p style={styles.videoChannel}>{analysis.video.channelTitle}</p>}
              {analysis.video.id && <p style={styles.videoId}>Video ID: {analysis.video.id}</p>}
            </div>
          </section>
        )}

        <section style={styles.metricsGrid}>
          <Metric icon={<Users size={22} />} title="Comments Analyzed" value={data.comments.toLocaleString()} />
          <Metric icon={<Languages size={22} />} title="Languages" value={String(data.languages.length)} />
          <Metric icon={<Globe2 size={22} />} title="Countries" value={String(data.countries.length)} />
          <Metric icon={<MessageCircleQuestion size={22} />} title="Questions" value={String(data.questions.length)} />
        </section>

        <section style={styles.card}>
          <SectionHeader icon={<BarChart3 size={22} />} title="Sentiment Analysis" subtitle="Overall audience reaction" />
          <div style={styles.threeGrid}>
            <Sentiment label="Positive" value={data.positive} symbol="😊" />
            <Sentiment label="Neutral" value={data.neutral} symbol="😐" />
            <Sentiment label="Negative" value={data.negative} symbol="😕" />
          </div>
        </section>

        <section style={styles.twoGrid}>
          <InsightCard title="Language Intelligence" icon={<Languages size={21} />}>
            {data.languages.map(([name, value]) => <ProgressRow key={name} name={name} value={value} />)}
          </InsightCard>
          <InsightCard title="Location Signals" icon={<Globe2 size={21} />}>
            {data.countries.map(([name, value]) => <ProgressRow key={name} name={name} value={value} />)}
            <p style={styles.note}>Location values are estimated signals and may not represent exact viewer locations.</p>
          </InsightCard>
        </section>

        <section style={styles.card}>
          <SectionHeader icon={<TrendingUp size={21} />} title="Trending Topics & Demand" subtitle="Topics your audience appears to care about" />
          <div style={styles.topicGrid}>
            {data.topics.map(([topic, score], index) => (
              <div key={topic} style={styles.topicItem}>
                <div style={styles.topicLeft}><span style={styles.rank}>{index + 1}</span><span style={styles.topicName}>{topic}</span></div>
                <span style={styles.score}>{score}/100</span>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.card}>
          <SectionHeader icon={<MessageCircleQuestion size={21} />} title="Audience Question Miner" subtitle="Questions detected from audience comments" />
          {data.questions.map(([question, count]) => (
            <div key={question} style={styles.questionItem}>
              <div style={styles.questionContent}>
                <p style={styles.questionText}>{question}</p>
                <p style={styles.questionCount}>Detected {count.toLocaleString()} times</p>
              </div>
              <span style={styles.opportunity}>Opportunity</span>
            </div>
          ))}
        </section>

        <section style={styles.darkCard}>
          <SectionHeader icon={<Sparkles size={23} />} title="What Should You Create Next?" subtitle="Content opportunities based on audience demand" dark />
          <div style={styles.recommendGrid}>
            {data.recommendations.map((item, index) => (
              <div key={item.title} style={styles.recommendCard}>
                <div style={styles.recommendTop}><span style={styles.number}>#{index + 1}</span><span style={styles.recommendScore}>{item.score}/100</span></div>
                <h3 style={styles.recommendTitle}>{item.title}</h3>
                <p style={styles.recommendReason}>{item.reason}</p>
                <button type="button" style={styles.planButton}>Create Content Plan</button>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.card}>
          <SectionHeader icon={<CheckCircle2 size={22} />} title="AI Action Plan" subtitle="Recommended next steps" />
          <div style={styles.threeGrid}>
            <Action number="1" text={`Create content around "${data.topics[0][0]}".`} />
            <Action number="2" text={`Answer this audience question: "${data.questions[0][0]}"`} />
            <Action number="3" text={`Prioritize the topic with a ${data.topics[0][1]}/100 demand score.`} />
          </div>
        </section>

        <section style={styles.card}>
          <SectionHeader icon={<MessageCircleQuestion size={21} />} title="Sample Audience Comments" subtitle="Comments received from the analysis" />
          {analysis?.comments && analysis.comments.length > 0 ? analysis.comments.slice(0, 10).map((comment, index) => (
            <div key={`${comment.text}-${index}`} style={styles.commentItem}>
              <div style={styles.commentAvatar}>{(comment.author || "U").charAt(0).toUpperCase()}</div>
              <div><strong style={styles.commentAuthor}>{comment.author || "YouTube User"}</strong><p style={styles.commentText}>{comment.text}</p></div>
            </div>
          )) : <p style={styles.emptyText}>No comment details available.</p>}
        </section>

        <footer style={styles.footer}>AudiencePulse AI • Real audience analysis</footer>
      </div>
    </main>
  );
}

function buildDashboardData(analysis: AnalysisData | null): DashboardData {
  const comments = analysis?.comments ?? [];
  const total = analysis?.commentsAnalyzed ?? comments.length;
  if (total === 0) return {
    comments: 0, positive: 0, neutral: 0, negative: 0,
    languages: [["Unknown", 100]], countries: [["Unknown", 100]],
    topics: [["Audience feedback", 50], ["Viewer questions", 40], ["Content requests", 30]],
    questions: [["What should the creator cover next?", 1], ["Can you explain this topic?", 1], ["Can you make another video?", 1]],
    recommendations: [
      { title: "Create a follow-up video", score: 75, reason: "Audience feedback can be used to create a relevant follow-up." },
      { title: "Answer viewer questions", score: 70, reason: "Repeated questions can become dedicated content." },
      { title: "Create a detailed guide", score: 65, reason: "Detailed explanations can address audience needs." },
    ],
  };

  const text = comments.map((item) => item.text || "").join(" ").toLowerCase();
  const positiveHits = countWords(text, ["love", "great", "amazing", "awesome", "good", "best", "helpful", "super", "நல்ல", "அருமை", "சூப்பர்", "மிகவும்"]);
  const negativeHits = countWords(text, ["bad", "hate", "worst", "wrong", "poor", "disappointed", "not good", "terrible", "மோசம்", "தவறு"]);
  const neutralBase = Math.max(total - positiveHits - negativeHits, 0);
  const sentimentTotal = Math.max(positiveHits + negativeHits + neutralBase, 1);
  const positive = Math.round((positiveHits / sentimentTotal) * 100);
  const negative = Math.round((negativeHits / sentimentTotal) * 100);
  const neutral = Math.max(100 - positive - negative, 0);

  const tamilHits = countWords(text, ["எப்படி", "என்ன", "வேண்டும்", "நல்ல", "சென்னை", "தமிழ்", "பயணம்", "சாப்பாடு"]);
  const hindiHits = countWords(text, ["कैसे", "क्या", "है", "बहुत", "अच्छा", "भारत"]);
  const englishHits = countWords(text, ["the", "this", "that", "what", "how", "is", "can", "please"]);
  const languageTotal = tamilHits + hindiHits + englishHits;

  const languages: ScorePair[] = languageTotal > 0 ? [
    ["Tamil", Math.round((tamilHits / languageTotal) * 100)],
    ["English", Math.round((englishHits / languageTotal) * 100)],
    ["Hindi", Math.round((hindiHits / languageTotal) * 100)],
  ] : [["Tamil", 0], ["English", 0], ["Hindi", 0]];

  const questionComments = comments.filter((item) => (item.text || "").includes("?"));
  const questions: ScorePair[] = questionComments.length > 0
    ? questionComments.slice(0, 5).map((item): ScorePair => [item.text, 1])
    : [["What should the creator explain next?", 1], ["Can you make a detailed follow-up?", 1], ["Can you compare the options?", 1]];

  const topics: ScorePair[] = [
    ["Viewer interest", Math.min(95, 60 + positive)],
    ["Content questions", Math.min(90, 40 + questionComments.length * 5)],
    ["Audience requests", Math.min(85, 35 + comments.length)],
    ["Engagement", Math.min(80, 30 + Math.round(total / 10))],
  ];

  return {
    comments: total, positive, neutral, negative, languages,
    countries: [["Detected audience", 100]], topics, questions,
    recommendations: [
      { title: "Create a follow-up video", score: Math.min(98, 70 + Math.round(positive / 5)), reason: "Audience sentiment and repeated comments indicate interest in more content." },
      { title: "Answer the top viewer questions", score: Math.min(95, 65 + questionComments.length * 4), reason: "Questions in the comments can directly become useful content ideas." },
      { title: "Create a detailed audience guide", score: Math.min(92, 60 + Math.round(total / 20)), reason: "A structured guide can address repeated viewer needs in one video." },
    ],
  };
}

function countWords(text: string, words: string[]): number {
  return words.reduce((count, word) => count + ((text.match(new RegExp(escapeRegExp(word), "gi")) || []).length), 0);
}
function escapeRegExp(value: string): string { return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

function Metric({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return <div style={styles.metricCard}><div style={styles.metricIcon}>{icon}</div><p style={styles.metricTitle}>{title}</p><p style={styles.metricValue}>{value}</p></div>;
}
function Sentiment({ label, value, symbol }: { label: string; value: number; symbol: string }) {
  return <div style={styles.sentimentCard}><div style={styles.sentimentTop}><span>{symbol} {label}</span><strong>{value}%</strong></div><div style={styles.progressBackground}><div style={{ ...styles.progressFill, width: `${value}%` }} /></div></div>;
}
function ProgressRow({ name, value }: { name: string; value: number }) {
  return <div style={{ marginBottom: 18 }}><div style={styles.progressTop}><span>{name}</span><strong>{value}%</strong></div><div style={styles.progressBackground}><div style={{ ...styles.progressFill, width: `${value}%` }} /></div></div>;
}
function InsightCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <div style={styles.card}><div style={styles.sectionHeader}><div>{icon}</div><h2 style={styles.sectionTitle}>{title}</h2></div>{children}</div>;
}
function SectionHeader({ icon, title, subtitle, dark = false }: { icon: React.ReactNode; title: string; subtitle?: string; dark?: boolean }) {
  return <div style={styles.sectionHeader}><div style={{ color: dark ? "#fff" : "#0f172a" }}>{icon}</div><div><h2 style={{ ...styles.sectionTitle, color: dark ? "#fff" : "#0f172a" }}>{title}</h2>{subtitle && <p style={{ ...styles.sectionSubtitle, color: dark ? "#94a3b8" : "#64748b" }}>{subtitle}</p>}</div></div>;
}
function Action({ number, text }: { number: string; text: string }) {
  return <div style={styles.actionCard}><div style={styles.actionNumber}>{number}</div><p style={styles.actionText}>{text}</p></div>;
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#f8fafc", color: "#0f172a", padding: "28px 16px 60px", fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" },
  container: { width: "100%", maxWidth: 1200, margin: "0 auto" },
  backButton: { display: "inline-flex", alignItems: "center", gap: 8, border: "none", background: "transparent", color: "#475569", fontWeight: 700, fontSize: 14, padding: "8px 0", cursor: "pointer", marginBottom: 20 },
  header: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap", marginBottom: 24 },
  badge: { display: "inline-flex", alignItems: "center", gap: 6, background: "#dcfce7", color: "#166534", borderRadius: 999, padding: "7px 12px", fontSize: 11, fontWeight: 800, marginBottom: 12 },
  title: { margin: 0, fontSize: "clamp(30px, 6vw, 44px)", lineHeight: 1.1, fontWeight: 900, letterSpacing: "-1px" },
  subtitle: { margin: "9px 0 0", color: "#64748b", fontSize: 14, maxWidth: 700 },
  sourceBox: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "11px 15px", color: "#64748b", fontSize: 13 },
  videoCard: { display: "flex", alignItems: "center", gap: 18, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 18, padding: 16, marginBottom: 18, boxShadow: "0 3px 12px rgba(15,23,42,.05)", flexWrap: "wrap" },
  videoInfo: { minWidth: 0, flex: 1 }, thumbnail: { width: 180, height: 100, objectFit: "cover", borderRadius: 12 }, videoTitle: { margin: 0, fontSize: 18, fontWeight: 800 }, videoChannel: { margin: "7px 0 0", color: "#475569", fontSize: 13 }, videoId: { margin: "5px 0 0", color: "#94a3b8", fontSize: 11 },
  metricsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 15 }, metricCard: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 18, padding: 20, boxShadow: "0 3px 12px rgba(15,23,42,.05)" }, metricIcon: { color: "#475569" }, metricTitle: { color: "#64748b", fontSize: 13, margin: "14px 0 4px" }, metricValue: { margin: 0, fontSize: 28, fontWeight: 900 },
  card: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 20, padding: 22, marginTop: 18, boxShadow: "0 3px 12px rgba(15,23,42,.05)" }, commentsCard: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 20, padding: 22, marginTop: 18 }, darkCard: { background: "#0f172a", borderRadius: 24, padding: 24, marginTop: 18, color: "#fff" },
  sectionHeader: { display: "flex", alignItems: "center", gap: 11, marginBottom: 19 }, sectionTitle: { margin: 0, fontSize: 19, fontWeight: 850 }, sectionSubtitle: { margin: "4px 0 0", fontSize: 12 }, threeGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 13 }, twoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18 },
  sentimentCard: { border: "1px solid #e2e8f0", borderRadius: 14, padding: 16 }, sentimentTop: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, fontSize: 14 }, progressBackground: { height: 8, background: "#e2e8f0", borderRadius: 999, overflow: "hidden", marginTop: 9 }, progressFill: { height: "100%", background: "#0f172a", borderRadius: 999 }, progressTop: { display: "flex", justifyContent: "space-between", color: "#475569", fontSize: 13, marginBottom: 6 }, note: { color: "#94a3b8", fontSize: 11, lineHeight: 1.5, marginTop: 3 },
  topicGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 11 }, topicItem: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, border: "1px solid #e2e8f0", borderRadius: 14, padding: 13 }, topicLeft: { display: "flex", alignItems: "center", gap: 9, minWidth: 0 }, rank: { width: 31, height: 31, borderRadius: 9, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, flexShrink: 0 }, topicName: { fontSize: 14, fontWeight: 700 }, score: { background: "#0f172a", color: "#fff", padding: "6px 9px", borderRadius: 999, fontSize: 10, fontWeight: 800, whiteSpace: "nowrap" },
  questionItem: { display: "flex", alignItems: "center", gap: 14, border: "1px solid #e2e8f0", borderRadius: 14, padding: 15, marginBottom: 10, flexWrap: "wrap" }, questionContent: { flex: 1, minWidth: 0 }, questionText: { margin: 0, fontSize: 14, lineHeight: 1.5, fontWeight: 700 }, questionCount: { margin: "5px 0 0", color: "#64748b", fontSize: 11 }, opportunity: { background: "#fef3c7", color: "#92400e", padding: "6px 10px", borderRadius: 999, fontSize: 10, fontWeight: 800 },
  recommendGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 13 }, recommendCard: { background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 16, padding: 17 }, recommendTop: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }, number: { color: "#cbd5e1", fontSize: 12, fontWeight: 800 }, recommendScore: { background: "#fff", color: "#0f172a", padding: "6px 9px", borderRadius: 999, fontSize: 10, fontWeight: 900 }, recommendTitle: { margin: "17px 0 8px", fontSize: 17, lineHeight: 1.35, fontWeight: 800 }, recommendReason: { margin: 0, color: "#cbd5e1", fontSize: 12, lineHeight: 1.6 }, planButton: { width: "100%", marginTop: 15, border: "1px solid rgba(255,255,255,.15)", borderRadius: 10, background: "#fff", color: "#0f172a", padding: "10px 12px", fontSize: 12, fontWeight: 800, cursor: "pointer" },
  actionCard: { border: "1px solid #e2e8f0", borderRadius: 14, padding: 15 }, actionNumber: { width: 30, height: 30, borderRadius: 9, background: "#0f172a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 12 }, actionText: { margin: "12px 0 0", color: "#475569", fontSize: 13, lineHeight: 1.55 }, commentItem: { display: "flex", alignItems: "flex-start", gap: 12, borderBottom: "1px solid #f1f5f9", padding: "13px 0" }, commentAvatar: { width: 34, height: 34, minWidth: 34, borderRadius: "50%", background: "#e2e8f0", color: "#334155", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900 }, commentAuthor: { fontSize: 12, color: "#334155" }, commentText: { margin: "4px 0 0", color: "#475569", fontSize: 13, lineHeight: 1.5 }, emptyText: { color: "#94a3b8", fontSize: 13 }, footer: { textAlign: "center", color: "#94a3b8", fontSize: 11        {analysis?.video && (
          <section style={styles.videoCard}>
            {analysis.video.thumbnail && (
              <img
                src={analysis.video.thumbnail}
                alt="YouTube thumbnail"
                style={styles.thumbnail}
              />
            )}

            <div>
              <h2 style={styles.videoTitle}>
                {analysis.video.title ||
                  "YouTube Video"}
              </h2>

              {analysis.video.channelTitle && (
                <p style={styles.videoChannel}>
                  {analysis.video.channelTitle}
                </p>
              )}

              {analysis.video.id && (
                <p style={styles.videoId}>
                  Video ID: {analysis.video.id}
                </p>
              )}
            </div>
          </section>
        )}

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
            title="Questions"
            value={String(data.questions.length)}
          />
        </section>

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
              Location values are estimated signals and
              may not represent exact viewer locations.
            </p>
          </InsightCard>
        </section>
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

        <section style={styles.card}>
          <SectionHeader
            icon={<MessageCircleQuestion size={21} />}
            title="Audience Question Miner"
            subtitle="Questions detected from audience comments"
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
                    Detected {count.toLocaleString()} times
                  </p>
                </div>

                <span style={styles.opportunity}>
                  Opportunity
                </span>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.darkCard}>
          <SectionHeader
            icon={<Sparkles size={23} />}
            title="What Should You Create Next?"
            subtitle="Content opportunities based on audience demand"
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

                <button
                  type="button"
                  style={styles.planButton}
                >
                  Create Content Plan
                </button>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.card}>
          <SectionHeader
            icon={<CheckCircle2 size={22} />}
            title="AI Action Plan"
            subtitle="Recommended next steps"
          />

          <div style={styles.threeGrid}>
            <Action
              number="1"
              text={`Create content around "${data.topics[0][0]}".`}
            />

            <Action
              number="2"
              text={`Answer this audience question: "${data.questions[0][0]}"`}
            />

            <Action
              number="3"
              text={`Prioritize the topic with a ${data.topics[0][1]}/100 demand score.`}
            />
          </div>
        </section>

        <section style={styles.commentsCard}>
          <SectionHeader
            icon={<MessageCircleQuestion size={21} />}
            title="Sample Audience Comments"
            subtitle="Comments received from the analysis"
          />

          {analysis?.comments &&
          analysis.comments.length > 0 ? (
            analysis.comments
              .slice(0, 10)
              .map((comment, index) => (
                <div
                  key={`${comment.text}-${index}`}
                  style={styles.commentItem}
                >
                  <div style={styles.commentAvatar}>
                    {(comment.author || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <strong style={styles.commentAuthor}>
                      {comment.author || "YouTube User"}
                    </strong>

                    <p style={styles.commentText}>
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))
          ) : (
            <p style={styles.emptyText}>
              No comment details available.
            </p>
          )}
        </section>

        <footer style={styles.footer}>
          AudiencePulse AI • Real audience analysis
        </footer>
      </div>
    </main>
  );
}

function buildDashboardData(
  analysis: AnalysisData | null
): DashboardData {
  const comments =
    analysis?.comments || [];

  const total =
    analysis?.commentsAnalyzed ||
    comments.length ||
    0;

  if (total === 0) {
    return {
      comments: 0,
      positive: 0,
      neutral: 0,
      negative: 0,
      languages: [["Unknown", 100]],
      countries: [["Unknown", 100]],
      topics: [
        ["Audience feedback", 50],
        ["Viewer questions", 40],
        ["Content requests", 30],
      ],
      questions: [
        ["What should the creator cover next?", 1],
        ["Can you explain this topic?", 1],
        ["Can you make another video?", 1],
      ],
      recommendations: [
        {
          title: "Create a follow-up video",
          score: 75,
          reason:
            "Audience feedback can be used to create a relevant follow-up.",
        },
        {
          title: "Answer viewer questions",
          score: 70,
          reason:
            "Repeated questions can become dedicated content.",
        },
        {
          title: "Create a detailed guide",
          score: 65,
          reason:
            "Detailed explanations can address audience needs.",
        },
      ],
    };
  }

  const text = comments
    .map((item) => item.text || "")
    .join(" ")
    .toLowerCase();

  const positiveWords = [
    "love",
    "great",
    "amazing",
    "awesome",
    "good",
    "best",
    "helpful",
    "super",
    "நல்ல",
    "அருமை",
    "சூப்பர்",
    "மிகவும்",
  ];

  const negativeWords = [
    "bad",
    "hate",
    "worst",
    "wrong",
    "poor",
    "disappointed",
    "not good",
    "terrible",
    "மோசம்",
    "தவறு",
  ];

  const positiveHits = countWords(
    text,
    positiveWords
  );

  const negativeHits = countWords(
    text,
    negativeWords
  );

  const neutralBase =
    Math.max(
      total - positiveHits - negativeHits,
      0
    );

  const sentimentTotal =
    positiveHits +
    negativeHits +
    neutralBase;

  const positive = Math.round(
    (positiveHits / sentimentTotal) * 100
  );

  const negative = Math.round(
    (negativeHits / sentimentTotal) * 100
  );

  const neutral =
    Math.max(100 - positive - negative, 0);

  const tamilHits = countWords(text, [
    "எப்படி",
    "என்ன",
    "வேண்டும்",
    "நல்ல",
    "சென்னை",
    "தமிழ்",
    "பயணம்",
    "சாப்பாடு",
  ]);

  const hindiHits = countWords(text, [
    "कैसे",
    "क्या",
    "है",
    "बहुत",
    "अच्छा",
    "भारत",
  ]);

  const englishHits = countWords(text, [
    "the",
    "this",
    "that",
    "what",
    "how",
    "is",
    "can",
    "please",
  ]);

  const languageTotal =
    tamilHits + hindiHits + englishHits;

  const languages: [string, number][] =
  languageTotal > 0
    ? [
        ["Tamil", Math.round((tamilHits / languageTotal) * 100)],
        ["English", Math.round((englishHits / languageTotal) * 100)],
        ["Hindi", Math.round((hindiHits / languageTotal) * 100)],
      ]
    : [
        ["Tamil", 0],
        ["English", 0],
        ["Hindi", 0],
      ];

  const questionComments =
    comments.filter((item) =>
      (item.text || "").includes("?")
    );

  const questions =
    questionComments.length > 0
      ? questionComments
          .slice(0, 5)
          .map((item) => [
            item.text,
            1,
          ] as [string, number])
      : [
          [
            "What should the creator explain next?",
            1,
          ],
          [
            "Can you make a detailed follow-up?",
            1,
          ],
          [
            "Can you compare the options?",
            1,
          ],
        ];

  return {
    comments: total,
    positive,
    neutral,
    negative,

    languages,

    countries: [
      ["Detected audience", 100],
    ],

    topics: [
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
    ],

    questions,

    recommendations: [
      {
        title: "Create a follow-up video",
        score: Math.min(
          98,
          70 + Math.round(positive / 5)
        ),
        reason:
          "Audience sentiment and repeated comments indicate interest in more content.",
      },
      {
        title: "Answer the top viewer questions",
        score: Math.min(
          95,
          65 + questionComments.length * 4
        ),
        reason:
          "Questions in the comments can directly become useful content ideas.",
      },
      {
        title: "Create a detailed audience guide",
        score: Math.min(
          92,
          60 + Math.round(total / 20)
        ),
        reason:
          "A structured guide can address repeated viewer needs in one video.",
      },
    ],
  };
}

function countWords(
  text: string,
  words: string[]
) {
  return words.reduce(
    (count, word) =>
      count +
      (text.match(
        new RegExp(escapeRegExp(word), "gi")
      ) || []).length,
    0
  );
}

function escapeRegExp(value: string) {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
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
      <div style={styles.metricIcon}>{icon}</div>

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
        <div>{icon}</div>

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
          color: dark ? "#ffffff" : "#0f172a",
        }}
      >
        {icon}
      </div>

      <div>
        <h2
          style={{
            ...styles.sectionTitle,
            color: dark ? "#ffffff" : "#0f172a",
          }}
        >
          {title}
        </h2>

        {subtitle && (
          <p
            style={{
              ...styles.sectionSubtitle,
              color: dark
                ? "#94a3b8"
                : "#64748b",
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
    maxWidth: 1200,
    margin: "0 auto",
  },

  backButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    border: "none",
    background: "transparent",
    color: "#475569",
    fontWeight: 700,
    fontSize: 14,
    padding: "8px 0",
    cursor: "pointer",
    marginBottom: 20,
  },

  header: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 20,
    flexWrap: "wrap",
    marginBottom: 24,
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "#dcfce7",
    color: "#166534",
    borderRadius: 999,
    padding: "7px 12px",
    fontSize: 11,
    fontWeight: 800,
    marginBottom: 12,
  },

  title: {
    margin: 0,
    fontSize: "clamp(30px, 6vw, 44px)",
    lineHeight: 1.1,
    fontWeight: 900,
    letterSpacing: "-1px",
  },

  subtitle: {
    margin: "9px 0 0",
    color: "#64748b",
    fontSize: 14,
    maxWidth: 700,
  },

  sourceBox: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: "11px 15px",
    color: "#64748b",
    fontSize: 13,
  },

  videoCard: {
    display: "flex",
    alignItems: "center",
    gap: 18,
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    boxShadow:
      "0 3px 12px rgba(15,23,42,.05)",
    flexWrap: "wrap",
  },

  thumbnail: {
    width: 180,
    height: 100,
    objectFit: "cover",
    borderRadius: 12,
  },

  videoTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 800,
  },

  videoChannel: {
    margin: "7px 0 0",
    color: "#475569",
    fontSize: 13,
  },

  videoId: {
    margin: "5px 0 0",
    color: "#94a3b8",
    fontSize: 11,
  },

  metricsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(210px, 1fr))",
    gap: 15,
  },

  metricCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 18,
    padding: 20,
    boxShadow:
      "0 3px 12px rgba(15,23,42,.05)",
  },

  metricIcon: {
    color: "#475569",
  },

  metricTitle: {
    color: "#64748b",
    fontSize: 13,
    margin: "14px 0 4px",
  },

  metricValue: {
    margin: 0,
    fontSize: 28,
    fontWeight: 900,
  },

  card: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 20,
    padding: 22,
    marginTop: 18,
    boxShadow:
      "0 3px 12px rgba(15,23,42,.05)",
  },

  commentsCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 20,
    padding: 22,
    marginTop: 18,
    boxShadow:
      "0 3px 12px rgba(15,23,42,.05)",
  },

  darkCard: {
    background: "#0f172a",
    borderRadius: 24,
    padding: 24,
    marginTop: 18,
    color: "#ffffff",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: 11,
    marginBottom: 19,
  },

  sectionTitle: {
    margin: 0,
    fontSize: 19,
    fontWeight: 850,
  },

  sectionSubtitle: {
    margin: "4px 0 0",
    fontSize: 12,
  },

  threeGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 13,
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
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    fontSize: 14,
  },

  progressBackground: {
    height: 8,
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

  progressTop: {
    display: "flex",
    justifyContent: "space-between",
    color: "#475569",
    fontSize: 13,
    marginBottom: 6,
  },

  note: {
    color: "#94a3b8",
    fontSize: 11,
    lineHeight: 1.5,
    marginTop: 3,
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
    marginTop: 35,
  },
};
