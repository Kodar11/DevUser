import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/userService";
import { getServerSession } from "next-auth/next";
import { NEXT_AUTH_CONFIG } from "@/lib/nextAuthConfig";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params; // Post ID
    const session = await getServerSession(NEXT_AUTH_CONFIG);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    //@ts-ignore
    const userId = session.user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found in session" },
        { status: 401 }
      );
    }

    // Ensure userId is treated as an integer
    const userIdInt = parseInt(userId);

    // Fetch the post with its upvotes
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      select: { userUpvotes: true, upvoteCount: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if the user has already upvoted
    if (post.userUpvotes.includes(userIdInt)) {
      return NextResponse.json(
        { error: "User has already upvoted this post" },
        { status: 400 }
      );
    }

    // Add user ID to userUpvotes and increment upvoteCount
    const updatedPost = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        userUpvotes: {
          push: userIdInt, // Ensure userId is an integer
        },
        upvoteCount: {
          increment: 1, // Increment upvote count
        },
      },
      select: { upvoteCount: true }, // Ensure upvote count is returned
    });

    return NextResponse.json(
      { message: "Upvoted successfully", upvoteCount: updatedPost.upvoteCount },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error upvoting post:", error);
    return NextResponse.json(
      { error: "Failed to upvote. Please check your request." },
      { status: 500 }
    );
  }
}
