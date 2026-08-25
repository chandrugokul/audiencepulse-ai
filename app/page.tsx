"use client";

import { useState } from "react";
import {
  BarChart3,
  Globe2,
  MessageSquare,
  Sparkles,
  Play,
  ArrowRight,
  CheckCircle2,
  Youtube,
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
        "Please enter a valid YouTube URL such as https://youtube.com/watch?v=..."
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

      window.location.href = `/dashboard?${params.toString()}`;
    }, 1200);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">

        {/* Top Bar */}
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Sparkles size={19} />
            </div>

            <span className="font-bold tracking-tight">
              AudiencePulse AI
            </span>
          </div>

          <div className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800">
            DEMO MODE
          </div>
        </header>

        {/* Hero */}
        <section className="mb-8 overflow-hidden rounded-3xl bg-slate-900 px-5 py-10 text-white shadow-sm sm:px-8 md:py-14">
          <div className="max-w-3xl">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-slate-200 ring-1 ring-white/10">
              <Sparkles size={14} />
              YouTube Audience Intelligence
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Understand your audience.
              <span className="mt-2 block text-slate-300">
                Create better content.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Turn YouTube comments into audience intelligence and discover
              exactly what your viewers want you to create next.
            </p>

            <div className="mt-7 flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} />
                Comment intelligence
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} />
                Audience demand
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} />
                Content ideas
              </span>
            </div>

          </div>
        </section>

        {/* Analyze Card */}
        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-7 md:p-8">

          {/* Card Header */}
          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <Youtube size={24} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                Analyze a YouTube Video
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Enter a YouTube URL and choose an audience dataset.
              </p>
            </div>

          </div>

          {/* URL Input */}
          <div className="mt-7">

            <label className="mb-2 block text-sm font-bold text-slate-700">
              YouTube Video URL
            </label>

            <div className="relative">

              <Youtube
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (message) setMessage("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    analyzeVideo();
                  }
                }}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full rounded-xl border border-slate-300 bg-white py-4 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-4 focus:ring-slate-100"
              />

            </div>

            <p className="mt-2 text-xs text-slate-400">
              Example: https://youtube.com/watch?v=ABC123
            </p>

          </div>

          {/* Dataset */}
          <div className="mt-7">

            <div className="mb-3 flex items-center justify-between">
              <label className="block text-sm font-bold text-slate-700">
                Choose Audience Dataset
              </label>

              <span className="text-xs text-slate-400">
                Demo data
              </span>
            </div>

            <div className="grid gap-3 md:grid-cols-3">

              {datasets.map((item) => {

                const selected = dataset === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDataset(item.id)}
                    className={`group rounded-2xl border p-4 text-left transition ${
                      selected
                        ? "border-slate-900 bg-slate-900 text-white shadow-md"
                        : "border-slate-200 bg-white text-slate-900 hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-sm"
                    }`}
                  >

                    <div className="flex items-center justify-between">

                      <div className="font-bold">
                        {item.name}
                      </div>

                      {selected && (
                        <CheckCircle2 size={18} />
                      )}

                    </div>

                    <div
                      className={`mt-2 text-sm leading-5 ${
                        selected
                          ? "text-slate-300"
                          : "text-slate-500"
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
            <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {message}
            </div>
          )}

          {/* Analyze Button */}
          <button
            onClick={analyzeVideo}
            disabled={loading}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >

            {loading ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
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

          <p className="mt-3 text-center text-xs text-slate-400">
            Demo mode • Real YouTube comments are not being fetched yet.
          </p>

        </section>

        {/* Analysis Pipeline */}
        <section className="mt-10">

          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Audience intelligence
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              What AudiencePulse analyzes
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Turn thousands of audience comments into simple,
              actionable insights.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <Feature
              icon={<MessageSquare size={22} />}
              title="Comment Intelligence"
              text="Understand what viewers are saying, asking and requesting."
            />

            <Feature
              icon={<Globe2 size={22} />}
              title="Language & Location"
              text="Discover language patterns and regional audience signals."
            />

            <Feature
              icon={<BarChart3 size={22} />}
              title="Demand Score"
              text="Identify topics with strong repeated audience demand."
            />

            <Feature
              icon={<Sparkles size={22} />}
              title="Next Video AI"
              text="Generate content opportunities from audience demand."
            />

          </div>
        </section>

        {/* Simple Flow */}
        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">

          <div className="mb-6">
            <h2 className="text-xl font-bold">
              How it works
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Three simple steps to turn comments into content ideas.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">

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
        <footer className="py-10 text-center">

          <div className="text-sm font-semibold text-slate-600">
            AudiencePulse AI
          </div>

          <p className="mt-1 text-xs text-slate-400">
            POC Demo • Audience intelligence for creators
          </p>

        </footer>

      </div>
    </main>
  );
}

/* ---------------- Feature ---------------- */

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
    <div className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md">

      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-900 transition group-hover:bg-slate-900 group-hover:text-white">
        {icon}
      </div>

      <h3 className="font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {text}
      </p>

    </div>
  );
}

/* ---------------- Steps ---------------- */

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
    <div className="rounded-2xl border border-slate-200 p-5">

      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
        {number}
      </div>

      <h3 className="font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {text}
      </p>

    </div>
  );
}