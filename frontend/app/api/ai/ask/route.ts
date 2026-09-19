import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

const MAX_RETRIES = 3;

export async function POST(req: NextRequest) {
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured" },
      { status: 503 },
    );
  }

  try {
    const { question, data } = await req.json();

    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "Missing question" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const modelName = "gemini-3.5-flash";

    const model = genAI.getGenerativeModel({
      model: modelName,
    });

    const prompt = `
You are a construction project analyst answering a site manager's question about ONE specific project.

Use ONLY the project data provided below.

Rules:
- Never invent numbers, suppliers, dates, or facts.
- If the data does not contain enough information, say so clearly.
- Answer in 2-4 sentences.
- Use plain English.
- Be direct and specific.
- Mention real numbers from the project data whenever relevant.
- Do not use markdown.
- Do not greet the user.
- Do not add a sign-off.

PROJECT DATA:
${JSON.stringify(data)}

QUESTION:
${question}
`;

    let lastError: unknown;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const result = await model.generateContent(prompt);

        const answer = result.response.text().trim();

        return NextResponse.json({ answer });
      } catch (error) {
        lastError = error;

        if (attempt === MAX_RETRIES - 1) {
          break;
        }

        const delay = 1000 * Math.pow(2, attempt);

        console.warn(
          `Gemini ${modelName} unavailable. Retry ${
            attempt + 1
          }/${MAX_RETRIES} in ${delay}ms`,
        );

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    console.error("Gemini request failed:", lastError);

    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  } catch (error) {
    console.error("AI ask error:", error);

    return NextResponse.json({ error: "Invalid AI request" }, { status: 400 });
  }
}
