"use client";

import { useState } from "react";
import {
  BarChart3,
  Globe2,
  MessageSquare,
  Sparkles,
  Play,
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

  function analyzeVideo() {
    if (!url.trim()) {
      setMessage("Please enter a YouTube URL.");
      return;
    }

    setMessage("");
    setLoading(true);

    setTimeout(() => {
      const params = new URLSearchParams({
        dataset,
        url,
      });

      window.location.href = `/dashboard?${params.toString()}`;
    }, 1800);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-800">
            🟡 DEMO MODE — Sample comments
          </div>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            AudiencePulse AI
          </h1>

          <p className="mt-3 max-w-2xl text-lg leading-7 text-slate-600">
            Turn YouTube comments into audience intelligence and discover what
            your viewers want you to create next.
          </p>
        </header>

        {/* Analyze Card */}
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-slate-900 p-3 text-white">
              <Play size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Analyze a YouTube Video
              </h2>

              <p className="mt-1 text-slate-500">
                Enter a YouTube URL and choose a demo audience dataset.
              </p>
            </div>
          </div>

          {/* URL */}
          <div className="mt-7">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              YouTube Video URL
            </label>

            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* Dataset */}
          <div className="mt-6">
            <label className="mb-3 block text-sm font-semibold text-slate-700">
              Demo Dataset
            </label>

            <div className="grid gap-3 md:grid-cols-3">
              {datasets.map((item) => {
                const selected = dataset === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDataset(item.id)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      selected
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-900 hover:border-slate-400"
                    }`}
                  >
                    <div className="font-bold">{item.name}</div>

                    <div
                      className={`mt-1 text-sm ${
                        selected ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      {item.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error */}
          {message && (
            <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">
              {message}
            </div>
          )}

          {/* Button */}
          <button
            onClick={analyzeVideo}
            disabled={loading}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-4 font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Analyzing audience...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Analyze Comments
              </>
            )}
          </button>

          <p className="mt-3 text-center text-xs text-slate-400">
            Demo mode only. Real YouTube comments are not being fetched yet.
          </p>
        </section>

        {/* Analysis Pipeline */}
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            What AudiencePulse analyzes
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Feature
              icon={<MessageSquare size={22} />}
              title="Comment Intelligence"
              text="Understand what viewers are saying."
            />

            <Feature
              icon={<Globe2 size={22} />}
              title="Language & Location"
              text="Discover language and regional signals."
            />

            <Feature
              icon={<BarChart3 size={22} />}
              title="Demand Score"
              text="Find topics with strong audience demand."
            />

            <Feature
              icon={<Sparkles size={22} />}
              title="Next Video AI"
              text="Discover what you should create next."
            />
          </div>
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
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="mb-3 text-slate-900">{icon}</div>

      <h3 className="font-bold text-slate-900">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}