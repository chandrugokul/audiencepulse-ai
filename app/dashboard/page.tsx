"use client";

import { useSearchParams } from "next/navigation";
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

const dashboardData = {
  "tamil-travel": {
    title: "Tamil Travel Audience",
    subtitle: "Demo analysis for Tamil + English travel audience",
    comments: 12480,
    positive: 68,
    neutral: 21,
    negative: 11,
    languages: [
      ["Tamil", 46],
      ["English", 39],
      ["Tamil + English", 11],
      ["Other", 4],
    ],
    countries: [
      ["India", 61],
      ["UAE", 13],
      ["Singapore", 8],
      ["Malaysia", 6],
      ["Other", 12],
    ],
    topics: [
      ["Chennai travel", 94],
      ["Budget travel", 88],
      ["Tamil Nadu food", 82],
      ["Hotels", 73],
    ],
    questions: [
      ["Which places can we visit in Chennai for one day?", 436],
      ["Can you show budget hotels?", 318],
      ["What is the best time to visit?", 247],
    ],
    recommendations: [
      {
        title: "10 Best Places to Visit in Chennai",
        score: 94,
        reason: "High repeated demand for Chennai travel recommendations.",
      },
      {
        title: "Chennai Budget Travel Guide",
        score: 89,
        reason: "Viewers repeatedly ask about low-cost travel options.",
      },
      {
        title: "Best Tamil Nadu Food Road Trip",
        score: 84,
        reason: "Food and destination requests frequently appear together.",
      },
    ],
  },

  "us-technology": {
    title: "US Technology Audience",
    subtitle: "Demo analysis for English-speaking technology audience",
    comments: 18360,
    positive: 74,
    neutral: 18,
    negative: 8,
    languages: [
      ["English", 91],
      ["Spanish", 4],
      ["Hindi", 2],
      ["Other", 3],
    ],
    countries: [
      ["USA", 54],
      ["Canada", 14],
      ["UK", 11],
      ["Australia", 7],
      ["Other", 14],
    ],
    topics: [
      ["AI tools", 96],
      ["Automation", 91],
      ["SaaS", 84],
      ["Developer tools", 79],
    ],
    questions: [
      ["Which AI tool is best for beginners?", 528],
      ["Can you compare these tools?", 421],
      ["How much does this cost?", 302],
    ],
    recommendations: [
      {
        title: "5 AI Tools Every Beginner Should Try",
        score: 96,
        reason: "AI tool comparisons show the strongest audience demand.",
      },
      {
        title: "Best AI Automation Tools for Creators",
        score: 92,
        reason: "Automation appears frequently in high-engagement comments.",
      },
      {
        title: "AI Tools: Free vs Paid Comparison",
        score: 87,
        reason: "Pricing and comparison questions are repeated often.",
      },
    ],
  },

  "hindi-finance": {
    title: "Hindi Finance Audience",
    subtitle: "Demo analysis for Hindi + English finance audience",
    comments: 15720,
    positive: 71,
    neutral: 20,
    negative: 9,
    languages: [
      ["Hindi", 52],
      ["English", 28],
      ["Hindi + English", 16],
      ["Other", 4],
    ],
    countries: [
      ["India", 78],
      ["UAE", 8],
      ["USA", 5],
      ["Singapore", 3],
      ["Other", 6],
    ],
    topics: [
      ["Mutual funds", 95],
      ["Beginner investing", 91],
      ["Savings", 84],
      ["Budgeting", 76],
    ],
    questions: [
      ["How should a beginner start investing?", 612],
      ["Which mutual fund is suitable for beginners?", 488],
      ["How much should I save every month?", 365],
    ],
    recommendations: [
      {
        title: "Mutual Funds for Complete Beginners",
        score: 95,
        reason: "Beginner investing questions dominate the comments.",
      },
      {
        title: "How to Start Investing with ₹1,000",
        score: 91,
        reason: "Viewers repeatedly ask about starting with small amounts.",
      },
      {
        title: "Monthly Budget Plan for Beginners",
        score: 83,
        reason: "Savings and budgeting requests show consistent demand.",
      },
    ],
  },
};

export default function DashboardPage() {
  const searchParams = useSearchParams();

  const datasetId = searchParams.get("dataset") || "tamil-travel";

  const data =
    dashboardData[datasetId as keyof typeof dashboardData] ||
    dashboardData["tamil-travel"];

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <button
            onClick={() => (window.location.href = "/")}
            className="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft size={17} />
            Analyze another video
          </button>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-2 text-xs font-bold text-amber-800">
                🟡 DEMO DATA
              </div>

              <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                Audience Intelligence
              </h1>

              <p className="mt-2 text-slate-500">{data.subtitle}</p>
            </div>

            <div className="rounded-xl bg-white px-4 py-3 text-sm shadow-sm ring-1 ring-slate-200">
              <span className="text-slate-400">Dataset:</span>{" "}
              <strong>{data.title}</strong>
            </div>
          </div>
        </header>

        {/* Metrics */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            icon={<Users size={21} />}
            title="Comments Analyzed"
            value={data.comments.toLocaleString()}
          />

          <Metric
            icon={<Languages size={21} />}
            title="Languages"
            value={String(data.languages.length)}
          />

          <Metric
            icon={<Globe2 size={21} />}
            title="Countries"
            value={String(data.countries.length)}
          />

          <Metric
            icon={<MessageCircleQuestion size={21} />}
            title="Top Questions"
            value={data.questions.length.toString()}
          />
        </section>

        {/* Sentiment */}
        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-3">
            <BarChart3 size={22} />
            <div>
              <h2 className="font-bold text-slate-900">
                Sentiment Analysis
              </h2>
              <p className="text-sm text-slate-500">
                Overall audience reaction
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
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

        {/* Languages + Countries */}
        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <InsightCard
            title="Language Intelligence"
            icon={<Languages size={21} />}
          >
            {data.languages.map(([name, value]) => (
              <ProgressRow
                key={name}
                name={name}
                value={Number(value)}
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
                value={Number(value)}
              />
            ))}

            <p className="mt-4 text-xs text-slate-400">
              Location values are inferred signals for this demo and do not
              represent exact viewer locations.
            </p>
          </InsightCard>
        </section>

        {/* Topics */}
        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-3">
            <TrendingUp size={21} />
            <div>
              <h2 className="font-bold text-slate-900">
                Trending Topics & Demand
              </h2>
              <p className="text-sm text-slate-500">
                Topics your audience appears to care about
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {data.topics.map(([topic, score], index) => (
              <div
                key={topic}
                className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="font-semibold text-slate-800">
                    {topic}
                  </span>
                </div>

                <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">
                  {score}/100
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Questions */}
        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-3">
            <MessageCircleQuestion size={21} />
            <h2 className="font-bold text-slate-900">
              Audience Question Miner
            </h2>
          </div>

          <div className="mt-5 space-y-3">
            {data.questions.map(([question, count]) => (
              <div
                key={question}
                className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 p-4 md:flex-row md:items-center"
              >
                <div>
                  <p className="font-semibold text-slate-800">{question}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Asked {count.toLocaleString()} times
                  </p>
                </div>

                <span className="whitespace-nowrap rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                  Opportunity
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Recommendations */}
        <section className="mt-6 rounded-3xl bg-slate-900 p-6 text-white shadow-sm md:p-8">
          <div className="flex items-center gap-3">
            <Sparkles size={23} />
            <div>
              <h2 className="text-xl font-bold">
                What Should You Create Next?
              </h2>
              <p className="text-sm text-slate-400">
                Demo content opportunity engine
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {data.recommendations.map((item, index) => (
              <div
                key={item.title}
                className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/10"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-400">
                    #{index + 1}
                  </span>

                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-900">
                    {item.score}/100
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold">{item.title}</h3>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {item.reason}
                </p>

                <button className="mt-5 w-full rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-900">
                  Create Content Plan
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* AI Action Plan */}
        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={22} />
            <h2 className="font-bold text-slate-900">AI Action Plan</h2>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <Action
              number="1"
              text={`Create content around "${data.topics[0][0]}".`}
            />

            <Action
              number="2"
              text={`Answer the audience question: "${data.questions[0][0]}"`}
            />

            <Action
              number="3"
              text={`Prioritize the topic with a ${data.topics[0][1]}/100 demand score.`}
            />
          </div>