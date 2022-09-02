import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const cookie = request.cookies.get("votey-token");

  if (cookie) {
    return response;
  }

  response.cookies.set("votey-token", nanoid(), {
    sameSite: "strict",
  });

  return response;
}

export const config = {
  matcher: ["/", "/poll/:path*"],
};
