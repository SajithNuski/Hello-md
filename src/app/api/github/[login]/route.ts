import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchFacts, GitHubFactError } from "@/lib/github/fetchFacts";

export const runtime = "nodejs";

const paramsSchema = z.object({
  login: z
    .string()
    .min(1, "GitHub login is required")
    .max(39, "GitHub username too long")
    .regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/, "Invalid GitHub username format"),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { login: string } }
) {
  const parsedParams = paramsSchema.safeParse(params);

  if (!parsedParams.success) {
    const issue = parsedParams.error.issues[0];
    return NextResponse.json(
      {
        error: {
          code: "INVALID_INPUT",
          message: issue?.message || "Invalid username format",
        },
      },
      { status: 400 }
    );
  }

  const { login } = parsedParams.data;

  try {
    // Optional user token passed in authorization header
    const authHeader = request.headers.get("authorization");
    const userToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : undefined;

    const facts = await fetchFacts(login, userToken);

    return NextResponse.json(facts, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error: unknown) {
    if (error instanceof GitHubFactError) {
      return NextResponse.json(
        {
          error: {
            code: error.code,
            message: error.message,
          },
        },
        { status: error.status }
      );
    }

    const errObj = error as { code?: string; status?: number; message?: string; name?: string } | null;
    if (errObj && (errObj.code || errObj.name === "GitHubFactError")) {
      const status = errObj.status || (errObj.code === "USER_NOT_FOUND" ? 404 : 400);
      return NextResponse.json(
        {
          error: {
            code: errObj.code || "USER_NOT_FOUND",
            message: errObj.message || "GitHub error",
          },
        },
        { status }
      );
    }

    console.error(`[GET /api/github/${login}] Internal Error:`, error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to fetch GitHub facts. Please try again.",
        },
      },
      { status: 500 }
    );
  }
}
