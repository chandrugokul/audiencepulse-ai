"use client";

import { useRef, useState } from "react";
import {
  BarChart3,
  FileText,
  Globe2,
  MessageSquare,
  Play,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

const datasets = [
  {
    id: "tamil-travel",
    name: "Tamil Travel",
    description: "Tamil + English • India • Travel",
  },
  {
    id: "us-technology",
    name: "US Technology",
    description: "English • USA/Canada • Technology",
  },
  {
    id: "hindi-finance",
    name: "Hindi Finance",
    description: "Hindi + English • India • Finance",
  },
];

export default function Home() {
  const [url, setUrl] = useState("");
  const [dataset, setDataset] = useState("tamil-travel");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  async function analyzeVideo() {
    if (!url.trim()) {
      setMessage("Please enter a YouTube URL.");
      return;
    }

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to analyze YouTube video.");
      }

      sessionStorage.setItem(
        "audiencepulse-analysis",
        JSON.stringify(data)
      );

      const params = new URLSearchParams({
        dataset,
        url: url.trim(),
        videoId: data.video?.id || "",
        source: "youtube",
      });

      window.location.href = `/dashboard?${params.toString()}`;
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
      setLoading(false);
    }
  }

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setMessage("Please upload a CSV file.");
      return;
    }

    setMessage("");
    setCsvFile(file);
  }

  function removeCsv() {
    setCsvFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function analyzeCSV() {
    if (!csvFile) {
      setMessage("Please select a CSV file.");
      return;
    }

    setMessage("");
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("file", csvFile);
      formData.append("dataset", dataset);

      const response = await fetch("/api/analyze-csv", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to analyze CSV file."
        );
      }

      sessionStorage.setItem(
        "audiencepulse-analysis",
        JSON.stringify(data)
      );

      const params = new URLSearchParams({
        dataset,
        source: "csv",
      });

      window.location.href = `/dashboard?${params.toString()}`;
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
      setLoading(false);
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.badge}>
            <Sparkles size={14} />
            Audience Intelligence Platform
          </div>

          <h1 style={styles.heroTitle}>AudiencePulse AI</h1>

          <p style={styles.heroText}>
            Turn YouTube comments into audience intelligence and discover
            what your viewers want you to create next.
          </p>
        </header>

        <section style={styles.mainCard}>
          <div style={styles.cardHeader}>
            <div style={styles.iconBox}>
              <Play size={25} />
            </div>

            <div>
              <h2 style={styles.cardTitle}>
                Analyze a YouTube Video
              </h2>

              <p style={styles.cardSubtitle}>
                Enter a YouTube URL and analyze real audience comments.
              </p>
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              YouTube Video URL
            </label>

            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              Audience Profile
            </label>

            <div style={styles.datasetGrid}>
              {datasets.map((item) => {
                const selected = dataset === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDataset(item.id)}
                    disabled={loading}
                    style={{
                      ...styles.datasetCard,
                      ...(selected ? styles.datasetSelected : {}),
                    }}
                  >
                    <div style={styles.datasetName}>
                      {item.name}
                    </div>

                    <div
                      style={{
                        ...styles.datasetDescription,
                        color: selected ? "#cbd5e1" : "#64748b",
                      }}
                    >
                      {item.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={analyzeVideo}
            disabled={loading}
            style={styles.primaryButton}
          >
            {loading ? (
              <>
                <span style={styles.spinner} />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={19} />
                Analyze Real YouTube Comments
              </>
            )}
          </button>

          <div style={styles.divider}>
            <span>OR</span>
          </div>
          <div style={styles.csvBox}>
            <div style={styles.csvHeader}>
              <div style={styles.csvIcon}>
                <FileText size={21} />
              </div>

              <div>
                <h3 style={styles.csvTitle}>
                  Analyze Comments from CSV
                </h3>

                <p style={styles.csvSubtitle}>
                  No YouTube API key required.
                </p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            {!csvFile ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                style={styles.uploadButton}
              >
                <Upload size={18} />
                Choose CSV File
              </button>
            ) : (
              <div style={styles.fileSelected}>
                <div style={styles.fileInfo}>
                  <FileText size={19} />

                  <div>
                    <strong>{csvFile.name}</strong>

                    <div style={styles.fileSize}>
                      {(csvFile.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={removeCsv}
                  style={styles.removeButton}
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {csvFile && (
              <button
                onClick={analyzeCSV}
                disabled={loading}
                style={styles.csvAnalyzeButton}
              >
                {loading ? (
                  <>
                    <span style={styles.darkSpinner} />
                    Analyzing CSV...
                  </>
                ) : (
                  <>
                    <BarChart3 size={18} />
                    Analyze CSV Comments
                  </>
                )}
              </button>
            )}

            <p style={styles.csvHint}>
              CSV should contain a column named{" "}
              <strong>comment</strong>.
            </p>
          </div>

          {message && (
            <div style={styles.errorBox}>
              {message}
            </div>
          )}

          <p style={styles.securityText}>
            Your YouTube API key stays server-side and is never exposed
            to the browser.
          </p>
        </section>

        <section style={styles.featuresSection}>
          <h2 style={styles.featuresTitle}>
            What AudiencePulse analyzes
          </h2>

          <div style={styles.featureGrid}>
            <Feature
              icon={<MessageSquare size={22} />}
              title="Comment Intelligence"
              text="Understand what viewers are actually saying."
            />

            <Feature
              icon={<Globe2 size={22} />}
              title="Language Signals"
              text="Discover multilingual audience patterns."
            />

            <Feature
              icon={<BarChart3 size={22} />}
              title="Demand Score"
              text="Identify topics with strong audience demand."
            />

            <Feature
              icon={<Sparkles size={22} />}
              title="Next Video AI"
              text="Discover what your audience wants next."
            />
          </div>
        </section>

        <section style={styles.howSection}>
          <h2 style={styles.featuresTitle}>
            How it works
          </h2>

          <div style={styles.stepsGrid}>
            <Step
              number="1"
              title="Connect"
              text="Paste a YouTube URL or upload comments."
            />

            <Step
              number="2"
              title="Analyze"
              text="AudiencePulse processes the comments."
            />

            <Step
              number="3"
              title="Discover"
              text="Find sentiment, questions, topics and demand."
            />

            <Step
              number="4"
              title="Create"
              text="Turn audience demand into your next content."
            />
          </div>
        </section>

        <footer style={styles.footer}>
          AudiencePulse AI • POC
        </footer>
      </div>
    </main>
  );
}
function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div style={styles.featureCard}>
      <div style={styles.featureIcon}>{icon}</div>

      <h3 style={styles.featureTitle}>{title}</h3>

      <p style={styles.featureText}>{text}</p>
    </div>
  );
}

function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div style={styles.stepCard}>
      <div style={styles.stepNumber}>{number}</div>

      <h3 style={styles.stepTitle}>{title}</h3>

      <p style={styles.stepText}>{text}</p>
    </div>
  );
}

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
    textAlign: "center",
    marginBottom: 34,
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    background: "#ede9fe",
    color: "#6d28d9",
    borderRadius: 999,
    padding: "8px 14px",
    fontSize: 12,
    fontWeight: 800,
  },

  heroTitle: {
    fontSize: "clamp(38px, 8vw, 64px)",
    lineHeight: 1.05,
    margin: "18px 0 0",
    fontWeight: 900,
    letterSpacing: "-2px",
  },

  heroText: {
    maxWidth: 700,
    margin: "16px auto 0",
    color: "#64748b",
    fontSize: "clamp(15px, 2vw, 18px)",
    lineHeight: 1.7,
  },

  mainCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 26,
    padding: "clamp(20px, 4vw, 38px)",
    boxShadow: "0 12px 40px rgba(15,23,42,.07)",
  },

  cardHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
  },

  iconBox: {
    width: 50,
    height: 50,
    minWidth: 50,
    borderRadius: 15,
    background: "#0f172a",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  cardTitle: {
    margin: 0,
    fontSize: "clamp(20px, 4vw, 27px)",
    fontWeight: 850,
  },

  cardSubtitle: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: 14,
    lineHeight: 1.5,
  },

  field: {
    marginTop: 26,
  },

  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 800,
    color: "#334155",
    marginBottom: 9,
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #cbd5e1",
    borderRadius: 13,
    padding: "14px 15px",
    fontSize: 15,
    color: "#0f172a",
    outline: "none",
    background: "#ffffff",
  },

  datasetGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 10,
  },

  datasetCard: {
    border: "1px solid #e2e8f0",
    borderRadius: 15,
    background: "#ffffff",
    padding: 15,
    textAlign: "left",
    cursor: "pointer",
    minHeight: 82,
  },

  datasetSelected: {
    background: "#0f172a",
    borderColor: "#0f172a",
    color: "#ffffff",
  },

  datasetName: {
    fontWeight: 800,
    fontSize: 15,
  },

  datasetDescription: {
    marginTop: 6,
    fontSize: 12,
  },

  primaryButton: {
    width: "100%",
    marginTop: 25,
    border: "none",
    borderRadius: 14,
    background: "#0f172a",
    color: "#ffffff",
    padding: "15px 18px",
    fontSize: 15,
    fontWeight: 800,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  spinner: {
    width: 18,
    height: 18,
    borderRadius: "50%",
    border: "2px solid rgba(255,255,255,.35)",
    borderTopColor: "#ffffff",
    display: "inline-block",
  },

  divider: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    margin: "26px 0",
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: 800,
  },

  csvBox: {
    border: "1px dashed #cbd5e1",
    background: "#f8fafc",
    borderRadius: 18,
    padding: 18,
  },

  csvHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 15,
  },

  csvIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    background: "#e2e8f0",
    color: "#334155",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  csvTitle: {
    margin: 0,
    fontSize: 15,
    fontWeight: 800,
  },

  csvSubtitle: {
    margin: "4px 0 0",
    color: "#64748b",
    fontSize: 12,
  },

  uploadButton: {
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#0f172a",
    borderRadius: 12,
    padding: "11px 15px",
    fontWeight: 800,
    fontSize: 13,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  },

  fileSelected: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 13,
    padding: 12,
  },

  fileInfo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    minWidth: 0,
    color: "#334155",
  },

  fileSize: {
    color: "#94a3b8",
    fontSize: 11,
    marginTop: 3,
  },

  removeButton: {
    border: "none",
    background: "#f1f5f9",
    color: "#64748b",
    width: 34,
    height: 34,
    borderRadius: 9,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  csvAnalyzeButton: {
    width: "100%",
    marginTop: 12,
    border: "none",
    borderRadius: 12,
    background: "#334155",
    color: "#ffffff",
    padding: "13px",
    fontWeight: 800,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  darkSpinner: {
    width: 17,
    height: 17,
    borderRadius: "50%",
    border: "2px solid rgba(255,255,255,.35)",
    borderTopColor: "#ffffff",
    display: "inline-block",
  },

  csvHint: {
    color: "#94a3b8",
    fontSize: 11,
    margin: "12px 0 0",
  },

  errorBox: {
    marginTop: 18,
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    borderRadius: 12,
    padding: 13,
    fontSize: 13,
    fontWeight: 600,
  },

  securityText: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 11,
    margin: "17px 0 0",
  },

  featuresSection: {
    marginTop: 40,
  },

  featuresTitle: {
    fontSize: 22,
    fontWeight: 850,
    margin: "0 0 16px",
  },

  featureGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
  },

  featureCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 18,
    padding: 20,
  },

  featureIcon: {
    color: "#0f172a",
    marginBottom: 12,
  },

  featureTitle: {
    margin: 0,
    fontSize: 15,
    fontWeight: 800,
  },

  featureText: {
    margin: "7px 0 0",
    color: "#64748b",
    fontSize: 13,
    lineHeight: 1.6,
  },

  howSection: {
    marginTop: 40,
  },

  stepsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(210px, 1fr))",
    gap: 14,
  },

  stepCard: {
    background: "#0f172a",
    color: "#ffffff",
    borderRadius: 18,
    padding: 20,
  },

  stepNumber: {
    width: 34,
    height: 34,
    borderRadius: 10,
    background: "#ffffff",
    color: "#0f172a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
    marginBottom: 14,
  },

  stepTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: 800,
  },

  stepText: {
    margin: "7px 0 0",
    color: "#cbd5e1",
    fontSize: 13,
    lineHeight: 1.6,
  },

  footer: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 42,
  },
};
