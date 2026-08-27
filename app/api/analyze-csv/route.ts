import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "CSV file is required." },
        { status: 400 }
      );
    }

    const text = await file.text();

    if (!text.trim()) {
      return NextResponse.json(
        { error: "CSV file is empty." },
        { status: 400 }
      );
    }

    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length < 2) {
      return NextResponse.json(
        {
          error:
            "CSV must contain a header and at least one comment.",
        },
        { status: 400 }
      );
    }

    const headers = lines[0]
      .split(",")
      .map((header) =>
        header.trim().toLowerCase().replace(/^"|"$/g, "")
      );

    const commentIndex = headers.indexOf("comment");

    if (commentIndex === -1) {
      return NextResponse.json(
        {
          error:
            'CSV must contain a column named "comment".',
        },
        { status: 400 }
      );
    }

    const comments: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const columns = parseCSVLine(lines[i]);

      const comment = columns[commentIndex]
        ?.trim()
        .replace(/^"|"$/g, "");

      if (comment) {
        comments.push(comment);
      }
    }

    if (comments.length === 0) {
      return NextResponse.json(
        {
          error: "No comments were found in the CSV.",
        },
        { status: 400 }
      );
    }

    const analysis = analyzeComments(comments);

    return NextResponse.json({
      source: "csv",
      success: true,

      file: {
        name: file.name,
        size: file.size,
      },

      video: {
        id: "",
        title: "CSV Comment Analysis",
      },

      comments: {
        total: comments.length,
        analyzed: comments.length,
      },

      sentiment: analysis.sentiment,

      languages: analysis.languages,

      countries: [
        ["Unknown", 100],
      ],

      topics: analysis.topics,

      questions: analysis.questions,

      recommendations: analysis.recommendations,
    });
  } catch (error) {
    console.error("CSV analysis error:", error);

    return NextResponse.json(
      {
        error: "Unable to analyze CSV file.",
      },
      { status: 500 }
    );
  }
}

/* ----------------------------------------
   CSV PARSER
---------------------------------------- */

function parseCSVLine(line: string): string[] {
  const result: string[] = [];

  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (
        insideQuotes &&
        line[i + 1] === '"'
      ) {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (
      char === "," &&
      !insideQuotes
    ) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);

  return result;
}

/* ----------------------------------------
   COMMENT ANALYSIS
---------------------------------------- */

function analyzeComments(comments: string[]) {
  let positive = 0;
  let negative = 0;

  const questions: {
    text: string;
    count: number;
  }[] = [];

  const questionMap = new Map<string, number>();

  const topicKeywords: Record<string, string[]> = {
    travel: [
      "travel",
      "trip",
      "place",
      "places",
      "hotel",
      "tour",
      "visit",
      "เที่ยว",
    ],

    food: [
      "food",
      "restaurant",
      "eat",
      "eating",
      "recipe",
      "food",
    ],

    ai: [
      "ai",
      "chatgpt",
      "artificial intelligence",
      "automation",
    ],

    technology: [
      "technology",
      "tech",
      "software",
      "app",
      "tool",
      "developer",
    ],

    finance: [
      "money",
      "investment",
      "invest",
      "mutual fund",
      "saving",
      "finance",
      "stock",
    ],

    education: [
      "learn",
      "course",
      "education",
      "study",
      "tutorial",
    ],
  };

  const topicScores: Record<string, number> = {};

  const positiveWords = [
    "good",
    "great",
    "awesome",
    "excellent",
    "love",
    "amazing",
    "helpful",
    "best",
    "super",
    "thanks",
    "thank you",
  ];

  const negativeWords = [
    "bad",
    "worst",
    "hate",
    "boring",
    "wrong",
    "poor",
    "useless",
    "disappointed",
  ];

  for (const comment of comments) {
    const lower = comment.toLowerCase();

    for (const word of positiveWords) {
      if (lower.includes(word)) {
        positive++;
        break;
      }
    }

    for (const word of negativeWords) {
      if (lower.includes(word)) {
        negative++;
        break;
      }
    }

    if (
      lower.includes("?") ||
      lower.startsWith("how ") ||
      lower.startsWith("what ") ||
      lower.startsWith("where ") ||
      lower.startsWith("which ") ||
      lower.startsWith("can ")
    ) {
      const cleanQuestion = comment.trim();

      questionMap.set(
        cleanQuestion,
        (questionMap.get(cleanQuestion) || 0) + 1
      );
    }

    for (const [topic, keywords] of Object.entries(
      topicKeywords
    )) {
      for (const keyword of keywords) {
        if (lower.includes(keyword)) {
          topicScores[topic] =
            (topicScores[topic] || 0) + 1;

          break;
        }
      }
    }
  }

  const total = comments.length;

  const positivePercent = Math.round(
    (positive / total) * 100
  );

  const negativePercent = Math.round(
    (negative / total) * 100
  );

  const neutralPercent = Math.max(
    0,
    100 - positivePercent - negativePercent
  );

  const sentiment = {
    positive: positivePercent,
    neutral: neutralPercent,
    negative: negativePercent,
  };

  const topics = Object.entries(topicScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([topic, count]) => [
      formatTopic(topic),
      Math.min(
        99,
        Math.max(
          40,
          Math.round((count / total) * 100)
        )
      ),
    ] as [string, number]);

  if (topics.length === 0) {
    topics.push(
      ["General Discussion", 50],
      ["Audience Feedback", 45]
    );
  }

  const topQuestions = Array.from(
    questionMap.entries()
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([text, count]) => ({
      text,