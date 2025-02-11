import { prisma } from "@/lib/prisma/userService";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { NEXT_AUTH_CONFIG } from "@/lib/nextAuthConfig";

// Create a parent comment for a post
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(NEXT_AUTH_CONFIG);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  
  const userId = session.user?.id;
  const postId = parseInt(params.id, 10);
  const { content } = await req.json();

  if (!content || isNaN(postId)) {
    return NextResponse.json(
      { error: "Content and post ID are required" },
      { status: 400 }
    );
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        commenterId: userId,
      },
    });

    return NextResponse.json(
      { message: "Comment created successfully", comment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}


// Fetch all parent comments for a post
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const postId = parseInt(params.id);

  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        commenter: { select: { id: true, username: true } },
        childComments: {
          include: { commenter: { select: { id: true, username: true } } },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}
