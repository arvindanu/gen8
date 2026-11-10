
import { NextRequest, NextResponse } from "next/server";
import { getIGDBGames, type IGDBOrdering } from "@/lib/igdb";

export const dynamic = "force-dynamic";

const ORDERING_MAP: Record<string, IGDBOrdering> = {
  "-added": "popularity",
  "-rating": "rating",
  "-released": "released",
  "-metacritic": "metacritic",
  name: "name",
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() ?? "";

    const requestedPage = Number(searchParams.get("page") ?? 1);
    const requestedPageSize = Number(
      searchParams.get("page_size") ?? 20
    );

    const page =
      Number.isInteger(requestedPage) && requestedPage > 0
        ? Math.min(requestedPage, 1000)
        : 1;

    const pageSize =
      Number.isInteger(requestedPageSize) && requestedPageSize > 0
        ? Math.min(requestedPageSize, 50)
        : 20;

    const requestedOrdering = searchParams.get("ordering") ?? "-added";

    const ordering =
      ORDERING_MAP[requestedOrdering] ?? "popularity";

    const data = await getIGDBGames({
      search,
      page,
      pageSize,
      ordering,
    });

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Games API route error:", error);

    return NextResponse.json(
      {
        error: "Unable to load games. Please try again later.",
      },
      { status: 500 }
    );
  }
}
