
import { NextResponse } from "next/server";
import { getIGDBFilterOptions } from "@/lib/igdb";

export const revalidate = 86400;

export async function GET() {
  try {
    const options = await getIGDBFilterOptions();

    return NextResponse.json(options, {
      headers: {
        "Cache-Control":
          "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    console.error("Game filter options error:", error);

    return NextResponse.json(
      { error: "Unable to load game filters." },
      { status: 500 }
    );
  }
}
