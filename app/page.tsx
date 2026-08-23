"use client";

import { useState } from "react";
import { BarChart3, MessageSquare, Globe2, Sparkles } from "lucide-react";

export default function Home() {
  const [url, setUrl] = useState("");

  return (
    <main style={{ minHeight: "100vh", padding: "40px 20px" }}>
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: 40 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: 999,
              background: "#fff3cd",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            🟡 DEMO MODE
          </div>

          <h1
            style={{
              fontSize: 42,
              margin: "18px 0 10px",
            }}
          >
            AudiencePulse AI
          </h1>

          <p
            style={{
              fontSize: 18,
              color: "#6b7280",
              maxWidth: 700,
            }}
          >
            Turn YouTube comments into audience insights and discover what
            your viewers want you to create next.
          </p>
        </div>

        <section
          style={{
            background: "white",
            borderRadius: 20,
            padding: 28,
            boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
            marginBottom: 30,
          }}
        >
          <h2 style={{ marginTop: 0 }}>Analyze a YouTube Video</h2>

          <p style={{ color: "#6b7280" }}>
            Paste a YouTube URL to start your audience analysis.
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 20,
              flexWrap: "wrap",
            }}
          >
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              style={{
                flex: 1,
                minWidth: 250,
                padding: "14px 16px",
                border: "1px solid #d1d5db",
                borderRadius: 12,
                outline: "none",
              }}
            />

            <button
              onClick={() => alert("Demo analysis will be added next.")}
              style={{
                border: 0,
                borderRadius: 12,
                padding: "14px 22px",
                background: "#111827",
                color: "white",
                fontWeight: 700,
              }}
            >
              Analyze Comments
            </button>
          </div>
        </section>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 18,
          }}
        >
          <Feature
            icon={<MessageSquare size={24} />}
            title="Comment Intelligence"
            text="Understand what your audience is saying."
          />

          <Feature
            icon={<Globe2 size={24} />}
            title="Language & Location"
            text="Discover audience language and regional signals."
          />

          <Feature
            icon={<BarChart3 size={24} />}
            title="Demand Score"
            text="Identify topics with the highest audience demand."
          />

          <Feature
            icon={<Sparkles size={24} />}
            title="Next Video AI"
            text="Discover what you should create next."
          />
        </div>
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
        background: "white",
        borderRadius: 18,
        padding: 22,
        boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ marginBottom: 14 }}>{icon}</div>

      <h3 style={{ margin: "0 0 8px" }}>{title}</h3>

      <p style={{ margin: 0, color: "#6b7280", lineHeight: 1.5 }}>
        {text}
      </p>
    </div>
  );
}