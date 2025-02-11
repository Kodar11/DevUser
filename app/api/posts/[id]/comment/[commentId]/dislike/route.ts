import { prisma } from "@/lib/prisma/userService";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { NEXT_AUTH_CONFIG } from "@/lib/nextAuthConfig";

export async function POST(
  req: Request,
  { params }: { params: { commentId: string } }
) {
  const session = await getServerSession(NEXT_AUTH_CONFIG);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }


  const userId = session.user?.id;
  const commentId = parseInt(params.commentId, 10);

  if (isNaN(commentId)) {
    return NextResponse.json({ error: "Invalid comment ID" }, { status: 400 });
  }

  try {
    // Fetch comment to check if user already disliked it
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { userLikes: true, userDislikes: true, likes: true, dislikes: true },
    });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (comment.userDislikes.includes(userId)) {
      return NextResponse.json({ error: "You already disliked this comment" }, { status: 400 });
    }

    // Remove from likes if present
    // const updatedLikes = comment.userLikes.filter((id) => id !== userId);

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        dislikes: { increment: 1 },
        userDislikes: { push: userId }
      },
    });

    return NextResponse.json({ message: "Disliked successfully", dislikes: updatedComment.dislikes }, { status: 200 });
  } catch (error) {
    console.error("Error disliking comment:", error);
    return NextResponse.json({ error: "Failed to dislike comment" }, { status: 500 });
  }
}
