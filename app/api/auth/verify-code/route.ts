import { NextRequest, NextResponse } from "next/server";

// Code verification is disabled - using magic link sign-in instead
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "Code verification is not enabled. Please use the magic link in your email to sign in." },
    { status: 400 },
  );
}
