import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Please upload a CSV file." },
        { status: 400 }
      );
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      return NextResponse.json(
        { error: "Only CSV files are supported." },
        { status: 400 }
      );
    }

    const text = await file.text();

    if (!text.trim()) {
      return NextResponse.json(
        { error: "The CSV file is empty." },
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
            "CSV must contain a header row and at least one comment.",
        },
        { status: 400 }
      );
    }

    const headers = lines[0]
      .split(",")
      .map((header) => header.trim().toLowerCase());

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
      const columns = lines[i].split(",");

      const comment = columns[commentIndex]?.trim();

      if (comment) {
        comments.push(comment);
      }
    }

    if (comments.length === 0) {
      return NextResponse.json(
        {
          error: "No comments were found in the CSV file.",
        },
        { status: 400 }
      );
    }
    const positiveWords = [
      "good",
      "great",
      "awesome",
      "amazing",
      "love",
      "best",
      "excellent",
      "helpful",
      "நல்ல",
      "சூப்பர்",
      "அருமை",
    ];

    const negativeWords = [
      "bad",
      "worst",
      "hate",
      "terrible",
      "poor",
      "useless",
      "boring",
      "பிடிக்கவில்லை",
      "மோசம்",
    ];

    let positiveCount = 0;
    let negativeCount = 0;

    for (const comment of comments) {
      const lower = comment.toLowerCase();

      if (
        positiveWords.some((word) =>
          lower.includes(word)
        )
      ) {
        positiveCount++;
      }

      if (
        negativeWords.some((word) =>
          lower.includes(word)
        )
      ) {
        negativeCount++;
      }
    }

    const total = comments.length;

    const positive = Math.round(
      (positiveCount / total) * 100
    );

    const negative = Math.round(
      (negativeCount / total) * 100
    );

    const neutral = Math.max(
      0,
      100 - positive - negative
    );

    const analysis = {
      source: "csv",
      commentsAnalyzed: total,

      sentiment: {
        positive,
        neutral,
        negative,
      },

      comments,
    };

    return NextResponse.json(analysis);  } catch (error) {
    console.error("CSV analysis error:", error);

    return NextResponse.json(
      {
        error: "Unable to analyze CSV file.",
      },
      { status: 500 }
    );
  }
}