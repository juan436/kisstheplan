import { NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function middleware() {
  // Since we use localStorage (not cookies) for tokens,
  // the real auth check happens client-side in the AppLayout.
  // This middleware is a placeholder for future cookie-based auth.
  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/login", "/register"],
};
