"use client";

import { useRef, useState } from "react";
import {
  BarChart3,
  FileText,
  MessageSquare,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

export default function Home() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setMessage("Please select a CSV file.");
      return;
    }

    setMessage("");
    setCsvFile(file);
  }

  function removeFile() {
    setCsvFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function analyzeCSV() {
    if (!csvFile) {
      setMessage("Please choose a CSV file first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();

      formData.append("file", csvFile);

      const response = await fetch("/api/analyze-csv", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "CSV analysis failed."
        );
      }

      sessionStorage.setItem(
        "audiencepulse-analysis",
        JSON.stringify(data)
      );

      window.location.href = "/dashboard?source=csv";
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );

      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <header
          style={{
            textAlign: "center",
            marginBottom: 35,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#ede9fe",
              color: "#6d28d9",
              padding: "8px 14px",
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            <Sparkles size={16} />
            Audience Intelligence Platform
          </div>

          <h1
            style={{
              fontSize: 52,
              margin: "18px 0 10px",
              fontWeight: 900,
            }}
          >
            AudiencePulse AI
          </h1>

          <p
            style={{
              color: "#64748b",
              fontSize: 18,
            }}
          >
            Upload YouTube comments and discover what
            your audience really wants.
          </p>
        </header>

        <section
          style={{
            background: "#ffffff",
            borderRadius: 24,
            padding: 30,
            border: "1px solid #e2e8f0",
            boxShadow:
              "0 10px 35px rgba(15,23,42,.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 25,
            }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: 14,
                background: "#0f172a",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FileText size={24} />
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 24,
                }}
              >
                Analyze YouTube Comments
              </h2>

              <p
                style={{
                  margin: "5px 0 0",
                  color: "#64748b",
                }}
              >
                Upload your CSV file to start analysis.
              </p>
            </div>
          </div>

          <div
            style={{
              border: "2px dashed #cbd5e1",
              borderRadius: 18,
              padding: 35,
              textAlign: "center",
              background: "#f8fafc",
            }}
          >
            <Upload
              size={42}
              style={{
                margin: "0 auto 15px",
                color: "#64748b",
              }}
            />

            <h3>
              Upload Comments CSV
            </h3>

            <p
              style={{
                color: "#64748b",
                fontSize: 14,
              }}
            >
              CSV file must contain a column named
              <strong> comment</strong>
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            {!csvFile && (
              <button
                onClick={() =>
                  fileInputRef.current?.click()
                }
                style={{
                  marginTop: 15,
                  padding: "13px 22px",
                  border: "none",
                  borderRadius: 12,
                  background: "#0f172a",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <Upload size={17} />
                {" "}Choose CSV File
              </button>
            )}

            {csvFile && (
              <div
                style={{
                  marginTop: 20,
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 14,
                  padding: 14,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <FileText size={20} />

                  <div style={{ textAlign: "left" }}>
                    <strong>{csvFile.name}</strong>

                    <div
                      style={{
                        color: "#94a3b8",
                        fontSize: 12,
                      }}
                    >
                      {(csvFile.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                </div>

                <button
                  onClick={removeFile}
                  style={{
                    border: "none",
                    background: "#f1f5f9",
                    borderRadius: 8,
                    padding: 8,
                    cursor: "pointer",
                  }}
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
                  width: "100%",
                  marginTop: 18,
                  padding: 15,
                  border: "none",
                  borderRadius: 12,
                  background: "#0f172a",
                  color: "#fff",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {loading
                  ? "Analyzing CSV..."
                  : "Analyze CSV Comments"}
              </button>
            )}
          </div>

          {message && (
            <div
              style={{
                marginTop: 18,
                padding: 14,
                borderRadius: 12,
                background: "#fef2f2",
                color: "#b91c1c",
              }}
            >
              {message}
            </div>
          )}
        </section>

        <section
          style={{
            marginTop: 30,
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(200px,1fr))",
            gap: 15,
          }}
        >
          <Feature
            icon={<MessageSquare size={22} />}
            title="Comment Intelligence"
            text="Understand what viewers are saying."
          />

          <Feature
            icon={<BarChart3 size={22} />}
            title="Demand Score"
            text="Find topics your audience wants."
          />

          <Feature
            icon={<Sparkles size={22} />}
            title="Next Video AI"
            text="Discover your next content idea."
          />
        </section>
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
    <div
      style={{
        background: "#fff",
        padding: 20,
        borderRadius: 16,
        border: "1px solid #e2e8f0",
      }}
    >
      {icon}

      <h3>{title}</h3>

      <p
        style={{
          color: "#64748b",
          fontSize: 14,
        }}
      >
        {text}
      </p>
    </div>
  );
}
