import { prisma } from "@/lib/prisma/userService";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { NEXT_AUTH_CONFIG } from "@/lib/nextAuthConfig";

export async function GET(
  req: Request,
  { params }: { params: { id: string; solutionId: string } }
) {
  const solutionId = parseInt(params.solutionId, 10);
  if (isNaN(solutionId)) {
    return NextResponse.json({ error: "Invalid solution ID" }, { status: 400 });
  }

  try {
    const solution = await prisma.solution.findUnique({
      where: { id: solutionId },
    });

    if (!solution) {
      return NextResponse.json({ error: "Solution not found" }, { status: 404 });
    }

    return NextResponse.json({ solution }, { status: 200 });
  } catch (error) {
    console.error("Error fetching solution:", error);
    return NextResponse.json({ error: "Failed to fetch solution" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string; solutionId: string } }
) {
  const session = await getServerSession(NEXT_AUTH_CONFIG);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { solutionText, solutionLink, confidenceScore } = await req.json();
  const solutionId = parseInt(params.solutionId, 10);

  try {
    const updatedSolution = await prisma.solution.update({
      where: { id: solutionId },
      data: {
        solutionText,
        solutionLink,
        confidenceScore,
      },
    });

    return NextResponse.json({ message: "Solution updated successfully", solution: updatedSolution }, { status: 200 });
  } catch (error) {
    console.error("Error updating solution:", error);
    return NextResponse.json({ error: "Failed to update solution" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; solutionId: string } }
) {
  const session = await getServerSession(NEXT_AUTH_CONFIG);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const solutionId = parseInt(params.solutionId, 10);

  try {
    await prisma.solution.delete({ where: { id: solutionId } });
    return NextResponse.json({ message: "Solution deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting solution:", error);
    return NextResponse.json({ error: "Failed to delete solution" }, { status: 500 });
  }
}
