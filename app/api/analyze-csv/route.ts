import { NextRequest, NextResponse } from "next/server";

function analyzeSentiment(text: string) {
  const positiveWords = [
    "good",
    "great",
    "awesome",
    "amazing",
    "excellent",
    "love",
    "best",
    "helpful",
    "nice",
    "super",
    "thanks",
    "thank you",
    "சூப்பர்",
    "நல்ல",
    "அருமை",
    "நன்றி",
  ];

  const negativeWords = [
    "bad",
    "worst",
    "hate",
    "boring",
    "wrong",
    "fake",
    "poor",
    "waste",
    "disappointed",
    "not good",
    "மோசம்",
    "பிடிக்கவில்லை",
  ];

  const lower = text.toLowerCase();

  const positive = positiveWords.some((word) =>
    lower.includes(word)
  );

  const negative = negativeWords.some((word) =>
    lower.includes(word)
  );

  if (positive && !negative) return "positive";
  if (negative && !positive) return "negative";

  return "neutral";
}

function detectLanguage(text: string) {
  const tamil = /[\u0B80-\u0BFF]/.test(text);
  const hindi = /[\u0900-\u097F]/.test(text);

  if (tamil && /[a-zA-Z]/.test(text)) {
    return "Tamil + English";
  }

  if (tamil) {
    return "Tamil";
  }

  if (hindi && /[a-zA-Z]/.test(text)) {
    return "Hindi + English";
  }

  if (hindi) {
    return "Hindi";
  }

  if (/[a-zA-Z]/.test(text)) {
    return "English";
  }

  return "Other";
}

function parseCSV(csv: string) {
  const lines = csv
    .split(/\r?\n/)
    .filter((line) => line.trim());

  if (lines.length < 2) {
    return [];
  }

  const headers = lines[0]
    .split(",")
    .map((header) =>
      header
        .trim()
        .replace(/^"|"$/g, "")
        .toLowerCase()
    );

  const commentIndex = headers.findIndex(
    (header) =>
      header === "comment" ||
      header === "comments" ||
      header === "text"
  );

  if (commentIndex === -1) {
    throw new Error(
      'CSV must contain a "comment" column.'
    );
  }

  const rows: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const columns = lines[i]
      .split(",")
      .map((value) =>
        value.trim().replace(/^"|"$/g, "")
      );

    const comment = columns[commentIndex];

    if (comment) {
      rows.push(comment);
    }
  }

  return rows;
}

export async function POST(
  request: NextRequest
) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "Please upload a CSV file.",
        },
        { status: 400 }
      );
    }

    if (
      !file.name
        .toLowerCase()
        .endsWith(".csv")
    ) {
      return NextResponse.json(
        {
          error: "Only CSV files are supported.",
        },
        { status: 400 }
      );
    }

    const csvText = await file.text();

    const comments = parseCSV(csvText);

    if (!comments.length) {
      return NextResponse.json(
        {
          error:
            "No comments found. Make sure your CSV contains a comment column.",
        },
        { status: 400 }
      );
    }

    // --------------------------------
    // SENTIMENT
    // --------------------------------

    let positive = 0;
    let negative = 0;
    let neutral = 0;

    const sentimentComments = comments.map(
      (comment) => {
        const sentiment =
          analyzeSentiment(comment);

        if (sentiment === "positive") positive++;
        if (sentiment === "negative") negative++;
        if (sentiment === "neutral") neutral++;

        return {
          text: comment,
          sentiment,
        };
      }
    );

    const total = comments.length;

    const positivePercent = Math.round(
      (positive / total) * 100
    );

    const negativePercent = Math.round(
      (negative / total) * 100
    );

    const neutralPercent =
      100 -
      positivePercent -
      negativePercent;

    // --------------------------------
    // LANGUAGE
    // --------------------------------

    const languageCounts: Record<
      string,
      number
    > = {};

    comments.forEach((comment) => {
      const language =
        detectLanguage(comment);

      languageCounts[language] =
        (languageCounts[language] || 0) + 1;
    });

    const languages = Object.entries(
      languageCounts
    )
      .map(([name, count]) => [
        name,
        Math.round((count / total) * 100),
      ] as [string, number])
      .sort((a, b) => b[1] - a[1]);

    // --------------------------------
    // QUESTIONS
    // --------------------------------

    const questionCounts: Record<
      string,
      number
    > = {};

    comments.forEach((comment) => {
      const trimmed = comment.trim();

      if (
        trimmed.includes("?") ||
        /^(how|what|why|when|where|which|can|is|are|எப்படி|என்ன|எங்கே|ஏன்)/i.test(
          trimmed
        )
      ) {
        questionCounts[trimmed] =
          (questionCounts[trimmed] || 0) + 1;
      }
    });

    const questions = Object.entries(
      questionCounts
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // --------------------------------
    // TOPIC / WORD FREQUENCY
    // --------------------------------

    const stopWords = new Set([
      "the",
      "this",
      "that",
      "with",
      "from",
      "your",
      "you",
      "have",
      "very",
      "just",
      "for",
      "and",
      "are",
      "was",
      "but",
      "not",
      "what",
      "how",
      "can",
      "இது",
      "அது",
      "என்று",
      "மற்றும்",
    ]);

    const wordCounts: Record<
      string,
      number
    > = {};

    comments.forEach((comment) => {
      const words = comment
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .split(/\s+/)
        .filter(
          (word) =>
            word.length >= 3 &&
            !stopWords.has(word)
        );

      words.forEach((word) => {
        wordCounts[word] =
          (wordCounts[word] || 0) + 1;
      });
    });

    const topWords = Object.entries(
      wordCounts
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const topics = topWords.map(
      ([word, count]) => {
        const score = Math.min(
          100,
          Math.max(
            50,
            count * 10
          )
        );

        return [word, score] as [
          string,
          number
        ];
      }
    );

    // --------------------------------
    // RETURN
    // --------------------------------

    return NextResponse.json({
      success: true,

      source: "csv",

      demo: false,

      file: {
        name: file.name,
        size: file.size,
      },

      statistics: {
        commentsAnalyzed: total,
      },

      analysis: {
        commentsAnalyzed: total,

        sentiment: {
          positive: positivePercent,
          neutral: neutralPercent,
          negative: negativePercent,
        },

        languages,

        questions,

        topics,

        comments:
          sentimentComments.slice(0, 1000),
      },
    });
  } catch (error) {
    console.error(
      "CSV analysis error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to analyze CSV.",
      },
      { status: 500 }
    );
  }
}