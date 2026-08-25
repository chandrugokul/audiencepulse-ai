"use client";

import { useState } from "react";
import {
  BarChart3,
  Globe2,
  MessageSquare,
  Sparkles,
  Youtube,
  ArrowRight,
  CheckCircle2,
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
    description: "English • USA / Canada • Technology",
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

  function isValidYouTubeUrl(value: string) {
    try {
      const parsed = new URL(value);

      return (
        parsed.hostname.includes("youtube.com") ||
        parsed.hostname.includes("youtu.be")
      );
    } catch {
      return false;
    }
  }

  function analyzeVideo() {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setMessage("Please enter a YouTube video URL.");
      return;
    }

    if (!isValidYouTubeUrl(trimmedUrl)) {
      setMessage(
        "Please enter a valid YouTube URL."
      );
      return;
    }

    setMessage("");
    setLoading(true);

    setTimeout(() => {
      const params = new URLSearchParams({
        dataset,
        url: trimmedUrl,
      });

      window.location.href =
        `/dashboard?${params.toString()}`;
    }, 1200);
  }

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #f8fafc;
          color: #0f172a;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        button,
        input {
          font: inherit;
        }

        .ap-page {
          min-height: 100vh;
          background: #f8fafc;
          padding: 24px 16px;
        }

        .ap-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Header */

        .ap-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .ap-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 16px;
          font-weight: 800;
        }

        .ap-brand-icon {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: #0f172a;
          color: white;
        }

        .ap-demo {
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          padding: 7px 12px;
          background: #fef3c7;
          color: #92400e;
          font-size: 12px;
          font-weight: 800;
        }

        /* Hero */

        .ap-hero {
          background: #0f172a;
          color: white;
          border-radius: 28px;
          padding: 52px 42px;
          margin-bottom: 20px;
          box-shadow: 0 8px 30px rgba(15, 23, 42, 0.12);
        }

        .ap-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.1);
          color: #cbd5e1;
          font-size: 12px;
          font-weight: 700;
        }

        .ap-hero-title {
          margin: 20px 0 0;
          max-width: 780px;
          font-size: clamp(36px, 6vw, 62px);
          line-height: 1.05;
          letter-spacing: -2px;
          font-weight: 900;
        }

        .ap-hero-title span {
          display: block;
          color: #cbd5e1;
          margin-top: 8px;
        }

        .ap-hero-text {
          max-width: 700px;
          margin: 22px 0 0;
          color: #cbd5e1;
          font-size: 17px;
          line-height: 1.7;
        }

        .ap-benefits {
          display: flex;
          flex-wrap: wrap;
          gap: 18px;
          margin-top: 24px;
          color: #cbd5e1;
          font-size: 13px;
          font-weight: 600;
        }

        .ap-benefit {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        /* Main Analyze Card */

        .ap-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 30px;
          box-shadow: 0 4px 16px rgba(15,23,42,.05);
        }

        .ap-analyze-header {
          display: flex;
          align-items: flex-start;
          gap: 15px;
        }

        .ap-main-icon {
          width: 52px;
          height: 52px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 15px;
          background: #0f172a;
          color: white;
        }

        .ap-heading {
          margin: 0;
          font-size: 25px;
          font-weight: 800;
        }

        .ap-subheading {
          margin: 5px 0 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.6;
        }

        /* Input */

        .ap-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .ap-label {
          font-size: 14px;
          font-weight: 800;
          color: #334155;
        }

        .ap-small {
          color: #94a3b8;
          font-size: 12px;
        }

        .ap-input-wrapper {
          position: relative;
        }

        .ap-input-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }

        .ap-input {
          width: 100%;
          height: 52px;
          border: 1px solid #cbd5e1;
          border-radius: 13px;
          padding: 0 15px 0 45px;
          outline: none;
          color: #0f172a;
          background: white;
          font-size: 14px;
          transition: .2s;
        }

        .ap-input:focus {
          border-color: #64748b;
          box-shadow: 0 0 0 4px #f1f5f9;
        }

        .ap-example {
          margin-top: 7px;
          color: #94a3b8;
          font-size: 11px;
        }

        /* Dataset */

        .ap-dataset-section {
          margin-top: 27px;
        }

        .ap-dataset-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .ap-dataset {
          width: 100%;
          min-height: 100px;
          text-align: left;
          border: 1px solid #e2e8f0;
          background: white;
          color: #0f172a;
          border-radius: 16px;
          padding: 16px;
          cursor: pointer;
          transition: .2s;
        }

        .ap-dataset:hover {
          border-color: #94a3b8;
          transform: translateY(-1px);
        }

        .ap-dataset.selected {
          background: #0f172a;
          border-color: #0f172a;
          color: white;
          box-shadow: 0 6px 18px rgba(15,23,42,.15);
        }

        .ap-dataset-top {
          display: flex;
          justify-content: space-between;
          gap: 8px;
        }

        .ap-dataset-name {
          font-size: 14px;
          font-weight: 800;
        }

        .ap-dataset-description {
          margin-top: 8px;
          color: #64748b;
          font-size: 12px;
          line-height: 1.5;
        }

        .ap-dataset.selected
        .ap-dataset-description {
          color: #cbd5e1;
        }

        /* Error */

        .ap-error {
          margin-top: 18px;
          padding: 13px 15px;
          border-radius: 12px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          font-size: 13px;
          font-weight: 600;
        }

        /* Button */

        .ap-analyze-button {
          width: 100%;
          height: 54px;
          margin-top: 24px;
          border: none;
          border-radius: 13px;
          background: #0f172a;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          transition: .2s;
        }

        .ap-analyze-button:hover {
          background: #1e293b;
        }

        .ap-analyze-button:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        .ap-demo-note {
          margin: 10px 0 0;
          text-align: center;
          color: #94a3b8;
          font-size: 11px;
        }

        /* Features */

        .ap-section {
          margin-top: 35px;
        }

        .ap-section-label {
          color: #94a3b8;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .ap-section-title {
          margin: 5px 0 0;
          font-size: 25px;
          font-weight: 800;
        }

        .ap-section-text {
          margin: 7px 0 0;
          color: #64748b;
          font-size: 14px;
        }

        .ap-feature-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-top: 18px;
        }

        .ap-feature {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          padding: 20px;
          box-shadow: 0 3px 12px rgba(15,23,42,.04);
          transition: .2s;
        }

        .ap-feature:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(15,23,42,.07);
        }

        .ap-feature-icon {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: #f1f5f9;
          margin-bottom: 15px;
        }

        .ap-feature-title {
          margin: 0;
          font-size: 14px;
          font-weight: 800;
        }

        .ap-feature-text {
          margin: 8px 0 0;
          color: #64748b;
          font-size: 12px;
          line-height: 1.6;
        }

        /* How it works */

        .ap-how {
          margin-top: 30px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          padding: 25px;
        }

        .ap-step-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-top: 20px;
        }

        .ap-step {
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 18px;
        }

        .ap-step-number {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #0f172a;
          color: white;
          font-size: 11px;
          font-weight: 800;
        }

        .ap-step-title {
          margin: 13px 0 0;
          font-size: 14px;
          font-weight: 800;
        }

        .ap-step-text {
          margin: 7px 0 0;
          color: #64748b;
          font-size: 12px;
          line-height: 1.6;
        }

        /* Footer */

        .ap-footer {
          padding: 40px 0 20px;
          text-align: center;
        }

        .ap-footer-title {
          color: #475569;
          font-size: 13px;
          font-weight: 700;
        }

        .ap-footer-text {
          margin-top: 4px;
          color: #94a3b8;
          font-size: 11px;
        }

        /* Loading */

        .ap-spinner {
          width: 19px;
          height: 19px;
          border: 2px solid white;
          border-top-color: transparent;
          border-radius: 50%;
          animation: ap-spin .8s linear infinite;
        }

        @keyframes ap-spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Mobile */

        @media (max-width: 800px) {
          .ap-page {
            padding: 16px 12px;
          }

          .ap-hero {
            padding: 34px 22px;
            border-radius: 22px;
          }

          .ap-hero-title {
            font-size: 40px;
            letter-spacing: -1.5px;
          }

          .ap-hero-text {
            font-size: 15px;
          }

          .ap-dataset-grid {
            grid-template-columns: 1fr;
          }

          .ap-feature-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .ap-step-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 520px) {
          .ap-page {
            padding: 12px 10px;
          }

          .ap-header {
            margin-bottom: 16px;
          }

          .ap-brand {
            font-size: 14px;
          }

          .ap-brand-icon {
            width: 34px;
            height: 34px;
          }

          .ap-demo {
            font-size: 10px;
            padding: 6px 9px;
          }

          .ap-hero {
            padding: 30px 18px;
            border-radius: 20px;
          }

          .ap-hero-title {
            font-size: 34px;
          }

          .ap-benefits {
            flex-direction: column;
            gap: 9px;
          }

          .ap-card {
            padding: 20px 16px;
            border-radius: 20px;
          }

          .ap-heading {
            font-size: 21px;
          }

          .ap-main-icon {
            width: 45px;
            height: 45px;
          }

          .ap-feature-grid {
            grid-template-columns: 1fr;
          }

          .ap-section-title {
            font-size: 21px;
          }

          .ap-how {
            padding: 20px 16px;
          }
        }
      `}</style>

      <main className="ap-page">
        <div className="ap-container">

          {/* Header */}

          <header className="ap-header">

            <div className="ap-brand">
              <div className="ap-brand-icon">
                <Sparkles size={18} />
              </div>

              <span>
                AudiencePulse AI
              </span>
            </div>

            <div className="ap-demo">
              🟡 DEMO MODE
            </div>

          </header>

          {/* Hero */}

          <section className="ap-hero">

            <div className="ap-hero-badge">
              <Sparkles size={14} />
              YouTube Audience Intelligence
            </div>

            <h1 className="ap-hero-title">
              Understand your audience.
              <span>
                Create better content.
              </span>
            </h1>

            <p className="ap-hero-text">
              Turn YouTube comments into audience intelligence
              and discover exactly what your viewers want you
              to create next.
            </p>

            <div className="ap-benefits">

              <div className="ap-benefit">
                <CheckCircle2 size={16} />
                Comment intelligence
              </div>

              <div className="ap-benefit">
                <CheckCircle2 size={16} />
                Audience demand
              </div>

              <div className="ap-benefit">
                <CheckCircle2 size={16} />
                Content ideas
              </div>

            </div>

          </section>

          {/* Analyze */}

          <section className="ap-card">

            <div className="ap-analyze-header">

              <div className="ap-main-icon">
                <Youtube size={25} />
              </div>

              <div>
                <h2 className="ap-heading">
                  Analyze a YouTube Video
                </h2>

                <p className="ap-subheading">
                  Enter a YouTube URL and choose an audience
                  dataset.
                </p>
              </div>

            </div>

            {/* URL */}

            <div style={{ marginTop: 28 }}>

              <div className="ap-label-row">
                <label className="ap-label">
                  YouTube Video URL
                </label>

                <span className="ap-small">
                  Required
                </span>
              </div>

              <div className="ap-input-wrapper">

                <Youtube
                  size={19}
                  className="ap-input-icon"
                />

                <input
                  className="ap-input"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);

                    if (message) {
                      setMessage("");
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      analyzeVideo();
                    }
                  }}
                  placeholder="https://youtube.com/watch?v=..."
                />

              </div>

              <p className="ap-example">
                Example:
                {" "}
                https://youtube.com/watch?v=ABC123
              </p>

            </div>

            {/* Dataset */}

            <div className="ap-dataset-section">

              <div className="ap-label-row">
                <label className="ap-label">
                  Choose Audience Dataset
                </label>

                <span className="ap-small">
                  Demo data
                </span>
              </div>

              <div className="ap-dataset-grid">

                {datasets.map((item) => {

                  const selected =
                    dataset === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`ap-dataset ${
                        selected ? "selected" : ""
                      }`}
                      onClick={() =>
                        setDataset(item.id)
                      }
                    >

                      <div className="ap-dataset-top">

                        <span className="ap-dataset-name">
                          {item.name}
                        </span>

                        {selected && (
                          <CheckCircle2 size={17} />
                        )}

                      </div>

                      <div className="ap-dataset-description">
                        {item.description}
                      </div>

                    </button>
                  );
                })}

              </div>

            </div>

            {/* Error */}

            {message && (
              <div className="ap-error">
                {message}
              </div>
            )}

            {/* Analyze Button */}

            <button
              className="ap-analyze-button"
              onClick={analyzeVideo}
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="ap-spinner" />
                  Analyzing audience...
                </>
              ) : (
                <>
                  <Sparkles size={19} />
                  Analyze Comments
                  <ArrowRight size={18} />
                </>
              )}

            </button>

            <p className="ap-demo-note">
              Demo mode • Real YouTube comments are not
              being fetched yet.
            </p>

          </section>

          {/* Features */}

          <section className="ap-section">

            <div className="ap-section-label">
              Audience intelligence
            </div>

            <h2 className="ap-section-title">
              What AudiencePulse analyzes
            </h2>

            <p className="ap-section-text">
              Turn thousands of audience comments into
              simple, actionable insights.
            </p>

            <div className="ap-feature-grid">

              <Feature
                icon={<MessageSquare size={21} />}
                title="Comment Intelligence"
                text="Understand what viewers are saying, asking and requesting."
              />

              <Feature
                icon={<Globe2 size={21} />}
                title="Language & Location"
                text="Discover language patterns and regional audience signals."
              />

              <Feature
                icon={<BarChart3 size={21} />}
                title="Demand Score"
                text="Identify topics with strong repeated audience demand."
              />

              <Feature
                icon={<Sparkles size={21} />}
                title="Next Video AI"
                text="Generate content opportunities from audience demand."
              />

            </div>

          </section>

          {/* How It Works */}

          <section className="ap-how">

            <div className="ap-section-label">
              Simple workflow
            </div>

            <h2 className="ap-section-title">
              How it works
            </h2>

            <p className="ap-section-text">
              Three simple steps to turn comments into
              content ideas.
            </p>

            <div className="ap-step-grid">

              <Step
                number="01"
                title="Paste your video"
                text="Enter the YouTube video URL you want to analyze."
              />

              <Step
                number="02"
                title="Analyze audience"
                text="AudiencePulse identifies sentiment, languages, topics and questions."
              />

              <Step
                number="03"
                title="Create next"
                text="Use audience demand to decide what content to create next."
              />

            </div>

          </section>

          {/* Footer */}

          <footer className="ap-footer">

            <div className="ap-footer-title">
              AudiencePulse AI
            </div>

            <div className="ap-footer-text">
              POC Demo • Audience intelligence for creators
            </div>

          </footer>

        </div>
      </main>
    </>
  );
}

/* Feature */

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
    <div className="ap-feature">

      <div className="ap-feature-icon">
        {icon}
      </div>

      <h3 className="ap-feature-title">
        {title}
      </h3>

      <p className="ap-feature-text">
        {text}
      </p>

    </div>
  );
}

/* Step */

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
    <div className="ap-step">

      <div className="ap-step-number">
        {number}
      </div>

      <h3 className="ap-step-title">
        {title}
      </h3>

      <p className="ap-step-text">
        {text}
      </p>

    </div>
  );
}