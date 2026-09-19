import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  if (!apiKey) {
    // Soft-fail: the client falls back to the rule-based insight already
    // computed server-side, so a missing key never breaks the dashboard.
    return NextResponse.json({ error: "GEMINI_API_KEY is not configured" }, { status: 503 });
  }

  try {
    const body = await req.json();
    const { project, financial, progress, expensesByCategory } = body;

    const genAI = new GoogleGenerativeAI(apiKey);
    // Stable GA model as of mid-2026. Gemini 2.5 is scheduled for shutdown
    // 16 Oct 2026 — check ai.google.dev/gemini-api/docs/changelog before
    // this ships if it's been a while since you wrote this.
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const prompt = `You are a construction project analyst. Write ONE short, direct insight (max 2 sentences, no greeting, no markdown) about this project's financial and physical health, for a site manager glancing at a dashboard.

Project: ${project?.name ?? "Unnamed project"}
Budget: ${financial?.budget} DA, spent: ${financial?.spent} DA (${financial?.budgetConsumed}% consumed)
Physical progress: ${progress?.physical}%, financial progress: ${progress?.financial}%, gap: ${progress?.gap}%
Top expense categories: ${
      Array.isArray(expensesByCategory)
        ? expensesByCategory.map((e: { category: string; amount: number }) => `${e.category}: ${e.amount} DA`).join(", ")
        : "n/a"
    }

Tone is "success" if the financial/physical gap is 5% or under, otherwise "warning".
Reply with ONLY strict JSON, no code fences: {"message": string, "tone": "success" | "warning"}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/^```json\s*|\s*```$/g, "");
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("AI summary error:", err);
    return NextResponse.json({ error: "AI summary failed" }, { status: 500 });
  }
}