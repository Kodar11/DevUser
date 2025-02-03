import { prisma } from "@/lib/prisma/userService";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { NEXT_AUTH_CONFIG } from "@/lib/nextAuthConfig";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const postId = parseInt(params.id, 10);
  if (isNaN(postId)) {
    return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
  }

  try {
    const solutions = await prisma.solution.findMany({
      where: { postId },
      orderBy: { confidenceScore: "desc" },
    });

    return NextResponse.json({ solutions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching solutions:", error);
    return NextResponse.json({ error: "Failed to fetch solutions" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(NEXT_AUTH_CONFIG);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { solutionText, solutionLink, confidenceScore } = await req.json();
  const sourceType = "USER_SUBMITTED"
  const postId = parseInt(params.id, 10);
  //@ts-ignore
  const userId = parseInt(session.user?.id);


  if (!solutionText || !sourceType) {
    return NextResponse.json({ error: "Solution text and sourceType are required" }, { status: 400 });
  }

  try {
    const newSolution = await prisma.solution.create({
      data: {
        postId,
        solutionText,
        solutionLink,
        sourceType,
        confidenceScore: confidenceScore || 0,
        submittedById: sourceType === "USER_SUBMITTED" ? userId : null,
      },
    });

    return NextResponse.json({ message: "Solution added successfully", solution: newSolution }, { status: 201 });
  } catch (error) {
    console.error("Error adding solution:", error);
    return NextResponse.json({ error: "Failed to add solution" }, { status: 500 });
  }
}
