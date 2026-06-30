import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ENABLE_PREVIEW !== "true" &&
    request.nextUrl.pathname.startsWith("/preview")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/preview", "/preview/:path*"],
};
