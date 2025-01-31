import { prisma } from "@/lib/prisma/userService";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { NEXT_AUTH_CONFIG } from "@/lib/nextAuthConfig";

export async function POST(
  req: Request,
  { params }: { params: { commentId: string } }
) {
    console.log("Controlled here");
  const session = await getServerSession(NEXT_AUTH_CONFIG);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  //@ts-ignore
  const userId = session.user?.id;
  const userIdInt = parseInt(userId)
  const commentId = parseInt(params.commentId, 10);

  if (isNaN(commentId)) {
    return NextResponse.json({ error: "Invalid comment ID" }, { status: 400 });
  }

  try {
    // Fetch comment to check if user already liked it
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { userLikes: true, userDislikes: true, likes: true, dislikes: true },
    });
    if (comment?.userLikes.includes(userIdInt)) {
        return NextResponse.json(
          { error: "User has already upvoted this post" },
          { status: 400 }
        );
      }

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (comment.userLikes.includes(userId)) {
      return NextResponse.json({ error: "You already liked this comment" }, { status: 400 });
    }

    // Remove from dislikes if present
    // const updatedDislikes = comment.userDislikes.filter((id) => id !== userId);
    // console.log(updatedDislikes);
    

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        likes: { increment: 1 },
        userLikes: { push: userIdInt }
      },
    });

    return NextResponse.json({ message: "Liked successfully", likes: updatedComment.likes }, { status: 200 });
  } catch (error) {
    console.error("Error liking comment:", error);
    return NextResponse.json({ error: "Failed to like comment" }, { status: 500 });
  }
}
