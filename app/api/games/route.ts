
import { NextRequest, NextResponse } from "next/server";
import { getIGDBGames, type IGDBOrdering } from "@/lib/igdb";

export const dynamic = "force-dynamic";

const VALID_ORDERINGS: IGDBOrdering[] = [
  "popularity",
  "rating",
  "released",
  "metacritic",
  "name",
];

function getPositiveInteger(value: string | null): number | undefined {
  if (!value) return undefined;

  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed > 0
    ? parsed
    : undefined;
}

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

    const requestedOrdering = searchParams.get("ordering") ?? "popularity";

    const ordering: IGDBOrdering = VALID_ORDERINGS.includes(
      requestedOrdering as IGDBOrdering
    )
      ? (requestedOrdering as IGDBOrdering)
      : "popularity";

    const requestedRating = Number(searchParams.get("minRating"));

    const minRating =
      Number.isFinite(requestedRating) &&
      requestedRating >= 0 &&
      requestedRating <= 5
        ? requestedRating
        : undefined;

    const requestedYear = getPositiveInteger(searchParams.get("year"));

    const year =
      requestedYear && requestedYear >= 1970 && requestedYear <= 2100
        ? requestedYear
        : undefined;

    const data = await getIGDBGames({
      search,
      page,
      pageSize,
      ordering,
      filters: {
        genre: getPositiveInteger(searchParams.get("genre")),
        platform: getPositiveInteger(searchParams.get("platform")),
        year,
        minRating,
      },
    });

    return NextResponse.json(data, {
      headers: {
        "Cache-Control":
          "public, s-maxage=3600, stale-while-revalidate=86400",
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
