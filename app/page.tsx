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

  function isValidYouTubeUrl(value: string) {
    try {
      const parsed = new URL(value);

      const hosts = [
        "youtube.com",
        "www.youtube.com",
        "m.youtube.com",
        "youtu.be",
        "www.youtu.be",
      ];

      return hosts.includes(parsed.hostname);
    } catch {
      return false;
    }
  }

  async function analyzeVideo() {
    const cleanUrl = url.trim();

    if (!cleanUrl) {
      setMessage("Please enter a YouTube video URL.");
      return;
    }

    if (!isValidYouTubeUrl(cleanUrl)) {
      setMessage("Please enter a valid YouTube URL.");
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
        body: JSON.stringify({
          url: cleanUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to analyze this YouTube video."
        );
      }

      sessionStorage.setItem(
        "audiencepulse-analysis",
        JSON.stringify(data)
      );

      const params = new URLSearchParams({
        dataset,
        url: cleanUrl,
        videoId: data?.video?.id || "",
        source: "youtube",
      });

      window.location.href = `/dashboard?${params.toString()}`;
    } catch (error) {
      setLoading(false);

      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
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

    if (file.size > 20 * 1024 * 1024) {
      setMessage("CSV file must be smaller than 20 MB.");
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
      setMessage("Please select a CSV file first.");
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

      window.location.href =
        `/dashboard?${params.toString()}`;
    } catch (error) {
      setLoading(false);

      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    }
  }
  return (
    <main style={styles.page}>
      <div style={styles.container}>

        {/* HEADER */}

        <header style={styles.header}>
          <div style={styles.badge}>
            <Sparkles size={14} />
            Audience Intelligence Platform
          </div>

          <h1 style={styles.heroTitle}>
            AudiencePulse AI
          </h1>

          <p style={styles.heroText}>
            Turn YouTube comments into audience intelligence
            and discover what your viewers want you to create next.
          </p>
        </header>

        {/* MAIN CARD */}

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

          {/* URL */}

          <div style={styles.field}>
            <label style={styles.label}>
              YouTube Video URL
            </label>

            <input
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setMessage("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  analyzeVideo();
                }
              }}
              placeholder="https://youtube.com/watch?v=..."
              style={styles.input}
              disabled={loading}
              autoComplete="off"
            />

            <p style={styles.fieldHint}>
              Example: https://www.youtube.com/watch?v=XXXXXXXXXXX
            </p>
          </div>

          {/* AUDIENCE PROFILE */}

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
                      ...(selected
                        ? styles.datasetSelected
                        : {}),
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: 15,
                      }}
                    >
                      {item.name}
                    </div>

                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 12,
                        color: selected
                          ? "#cbd5e1"
                          : "#64748b",
                      }}
                    >
                      {item.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* YOUTUBE BUTTON */}

          <button
            onClick={analyzeVideo}
            disabled={loading}
            style={{
              ...styles.primaryButton,
              ...(loading ? styles.disabledButton : {}),
            }}
          >
            {loading ? (
              <>
                <span style={styles.spinner} />
                Analyzing YouTube comments...
              </>
            ) : (
              <>
                <Sparkles size={19} />
                Analyze Real YouTube Comments
              </>
            )}
          </button>

          {/* DIVIDER */}

          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span>OR</span>
            <div style={styles.dividerLine} />
          </div>

          {/* CSV */}

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
                  Analyze exported comments without using the YouTube API.
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
                onClick={() =>
                  fileInputRef.current?.click()
                }
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
                  disabled={loading}
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
                style={{
                  ...styles.csvAnalyzeButton,
                  ...(loading ? styles.disabledButton : {}),
                }}
              >
                {loading ? (
                  <>
                    <span style={styles.spinner} />
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

          {/* ERROR */}

          {message && (
            <div style={styles.errorBox}>
              {message}
            </div>
          )}

          <p style={styles.securityText}>
            🔒 Your YouTube API key stays on the server and is never exposed
            to the browser.
          </p>

        </section>

        {/* FEATURES */}

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

        {/* HOW IT WORKS */}

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

/* COMPONENTS */

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
      <div style={styles.featureIcon}>
        {icon}
      </div>

      <h3 style={styles.featureTitle}>
        {title}
      </h3>

      <p style={styles.featureText}>
        {text}
      </p>
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
      <div style={styles.stepNumber}>
        {number}
      </div>

      <h3 style={styles.stepTitle}>
        {title}
      </h3>

      <p style={styles.stepText}>
        {text}
      </p>
    </div>
  );
}

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
    fontSize: 14,
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
    marginTop: 45,
    color: "#94a3b8",
    fontSize: 11,
  },
};