import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  console.log("---------------------------------------------------");
  console.log(`middlware is running on ${request.nextUrl.pathname}`);

  const response = NextResponse.next();
  const cookie = request.cookies.get("votey");

  if (!cookie) {
    console.log("no cookie, have to set cookie");
    const random = Math.random().toString();
    response.cookies.set("votey", random, {
      sameSite: "strict",
    });
  } else {
    console.log(`already have cookie: ${cookie}`);
  }

  return response;
}

export const config = {
  matcher: ["/", "/poll/:path*"],
};
