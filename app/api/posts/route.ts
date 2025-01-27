import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/userService"; // Adjust path as needed
import { getServerSession } from "next-auth/next";
import { NEXT_AUTH_CONFIG } from "@/lib/nextAuthConfig"; // Adjust path as needed

export async function POST(req: Request) {

  const session = await getServerSession(NEXT_AUTH_CONFIG);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
//@ts-ignore
  const userId = session.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "User ID not found in session" }, { status: 401 });
  }

  const body = await req.json();
  const { problemTitle, description, tags, status } = body;

  if (!problemTitle || !description) {
    return NextResponse.json(
      { error: "Problem title and description are required" },
      { status: 400 }
    );
  }

  try {

    const problem = await prisma.post.create({
      data: {
        problemTitle,
        description,
        tags: tags || [], // Use the array directly
        status: status || "OPEN", // Default to OPEN if no status is provided
        authorId: parseInt(userId), // Convert userId to an integer
      },
    });

    return NextResponse.json(
      { message: "Problem created successfully", problem },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating problem:", error);
    return NextResponse.json(
      { error: "Failed to create problem" },
      { status: 500 }
    );
  }
}


export async function GET(req: Request) {
    try {
      const posts = await prisma.post.findMany({
        include: {
          author: {
            select: { id: true, username: true },
          },
          comments: {
            select: { id: true, content: true, likes: true, dislikes: true, commenter: { select: { username: true } } },
          },
        },
        orderBy: { createdAt: "desc" },
      });
  
      return NextResponse.json({ posts }, { status: 200 });
    } catch (error) {
      console.error("Error fetching posts:", error);
      return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
    }
  }
  