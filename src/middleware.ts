import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

export function middleware(request: NextRequest) {
  console.log("---------------------------------------------------");
  console.log(`middlware is running on ${request.nextUrl.pathname}`);

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
