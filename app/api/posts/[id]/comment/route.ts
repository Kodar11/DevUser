import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/userService";
import { getServerSession } from "next-auth/next";
import { NEXT_AUTH_CONFIG } from "@/lib/nextAuthConfig";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { content } = await req.json();

  // Retrieve session to get the user's ID
  const session = await getServerSession(NEXT_AUTH_CONFIG);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  //@ts-ignore
  const commenterId = session.user?.id;

  if (!commenterId) {
    return NextResponse.json({ error: "User ID not found in session" }, { status: 401 });
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        postId: parseInt(id), // Parse ID to an integer
        commenterId: parseInt(commenterId), // Parse commenter ID to an integer
      },
    });
    return NextResponse.json(
      { message: "Comment added successfully", comment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}
