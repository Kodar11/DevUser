import { prisma } from "@/lib/prisma/userService";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { NEXT_AUTH_CONFIG } from "@/lib/nextAuthConfig";

// Create a child comment under a parent comment
export async function POST(req: Request, { params }: { params: { id: string; commentId: string } }) {
  const session = await getServerSession(NEXT_AUTH_CONFIG);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }


  const userId = session.user?.id;
  const parentId = parseInt(params.commentId, 10);
  const { content } = await req.json();

  if (!content || isNaN(parentId)) {
    return NextResponse.json(
      { error: "Content and parent comment ID are required" },
      { status: 400 }
    );
  }

  try {
    const childComment = await prisma.childComment.create({
      data: {
        content,
        parentId,
        commenterId: userId,
      },
    });

    return NextResponse.json(
      { message: "Child comment created successfully", childComment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating child comment:", error);
    return NextResponse.json(
      { error: "Failed to create child comment" },
      { status: 500 }
    );
  }
}


// Fetch child comments for a parent comment
export async function GET(
  req: Request,
  { params }: { params: { id: string; commentId: string } }
) {
  const parentId = parseInt(params.commentId);

  try {
    const childComments = await prisma.childComment.findMany({
      where: { parentId },
      include: {
        commenter: { select: { id: true, username: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ childComments }, { status: 200 });
  } catch (error) {
    console.error("Error fetching child comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch child comments" },
      { status: 500 }
    );
  }
}
