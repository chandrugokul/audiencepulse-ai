"use client";

import { useRef, useState } from "react";
import {
  BarChart3,
  FileText,
  Globe2,
  MessageSquare,
  Play,
  Sparkles,
  Upload,
  X,
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
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function isValidYouTubeUrl(value: string) {
    try {
      const parsed = new URL(value);

      const hosts = [
        "youtube.com",
        "www.youtube.com",
        "m.youtube.com",
        "youtu.be",
        "www.youtu.be",
      ];

      return hosts.includes(parsed.hostname);
    } catch {
      return false;
    }
  }

  async function analyzeVideo() {
    const cleanUrl = url.trim();

    if (!cleanUrl) {
      setMessage("Please enter a YouTube video URL.");
      return;
    }

    if (!isValidYouTubeUrl(cleanUrl)) {
      setMessage("Please enter a valid YouTube URL.");
      return;
    }

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: cleanUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to analyze this YouTube video."
        );
      }

      sessionStorage.setItem(
        "audiencepulse-analysis",
        JSON.stringify(data)
      );

      const params = new URLSearchParams({
        dataset,
        url: cleanUrl,
        videoId: data?.video?.id || "",
        source: "youtube",
      });

      window.location.href = `/dashboard?${params.toString()}`;
    } catch (error) {
      setLoading(false);

      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    }
  }

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setMessage("Please upload a CSV file.");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setMessage("CSV file must be smaller than 20 MB.");
      return;
    }

    setMessage("");
    setCsvFile(file);
  }

  function removeCsv() {
    setCsvFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function analyzeCSV() {
    if (!csvFile) {
      setMessage("Please select a CSV file first.");
      return;
    }

    setMessage("");
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("file", csvFile);
      formData.append("dataset", dataset);

      const response = await fetch("/api/analyze-csv", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to analyze CSV file."
        );
      }

      sessionStorage.setItem(
        "audiencepulse-analysis",
        JSON.stringify(data)
      );

      const params = new URLSearchParams({
        dataset,
        source: "csv",
      });

      window.location.href =
        `/dashboard?${params.toString()}`;
    } catch (error) {
      setLoading(false);

      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    }
  }