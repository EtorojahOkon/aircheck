import { NextResponse } from "next/server";

export async function GET() {
  try {
    const url = process.env.ASSEMBLYAI_BASE_URL;
    const key = process.env.ASSEMBLYAI_API_KEY;

    if (!key || !url) {
      throw new Error("Missing Assembly AI key or url");
    }

    const fetchUrl = new URL(url);
    fetchUrl.searchParams.set("expires_in_seconds", "600");

    const response = await fetch(fetchUrl.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${key}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Failed to fetch token: ${response.status} ${errText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Token generation failed", details: error.message },
      { status: 500 },
    );
  }
}
