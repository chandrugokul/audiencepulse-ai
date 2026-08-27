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
            "CSV must contain a header row and at least one comment.",
        },
        { status: 400 }
      );
    const comments = lines
      .slice(1)
      .map((line) => {
        const columns = line.split(",");
        return columns[commentIndex]?.trim() || "";
      })
      .filter(Boolean);

    if (comments.length === 0) {
      return NextResponse.json(
        { error: "No comments found in CSV." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      source: "csv",
      commentsAnalyzed: comments.length,
      comments,
    });  } catch (error) {
    console.error("CSV analysis error:", error);

    return NextResponse.json(
      {
        error: "Unable to analyze CSV file.",
      },
      { status: 500 }
    );
  }
}
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
