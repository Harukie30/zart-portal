import { NextRequest, NextResponse } from "next/server";
import {
  getVisitorCount,
  incrementVisitorCount,
} from "@/lib/visitor-count";

const COOKIE = "ve-visitor";

export const dynamic = "force-dynamic";

function withCount(count: number, markSeen: boolean) {
  const response = NextResponse.json({ count });

  if (markSeen) {
    response.cookies.set(COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return response;
}

export async function GET() {
  const count = await getVisitorCount();
  return NextResponse.json({ count });
}

export async function POST(request: NextRequest) {
  const seen = request.cookies.get(COOKIE)?.value === "1";

  if (seen) {
    const count = await getVisitorCount();
    return withCount(count, false);
  }

  const count = await incrementVisitorCount();
  return withCount(count, true);
}
