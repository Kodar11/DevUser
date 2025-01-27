import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/userService";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    await prisma.post.update({
      where: { id: parseInt(id) },
      data: { upvote: { increment: 1 } },
    });
    return NextResponse.json({ message: "Upvoted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error upvoting post:", error);
    return NextResponse.json({ error: "Failed to upvote" }, { status: 500 });
  }
}
