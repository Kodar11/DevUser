import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/userService";
import { getServerSession } from "next-auth/next";
import { NEXT_AUTH_CONFIG } from "@/lib/nextAuthConfig";
import { QuestionType } from "@prisma/client";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params; // Extract postId from params
    const session = await getServerSession(NEXT_AUTH_CONFIG);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    //@ts-ignore
    const userId = session.user?.id;
    //@ts-ignore
    const userRole = session.user?.role;

    if (!userId || userRole !== "DEVELOPER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userIdInt = parseInt(userId);
    const postIdInt = parseInt(id);

    if (isNaN(postIdInt)) {
      return NextResponse.json({ error: "Invalid postId" }, { status: 400 });
    }

    const body = await req.json();
    const { questions } = body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: "Invalid questions format" }, { status: 400 });
    }

    for (const q of questions) {
      if (!q.questionText || typeof q.questionText !== "string") {
        return NextResponse.json(
          { error: "Invalid questionText in questions" },
          { status: 400 }
        );
      }
      if (!Object.values(QuestionType).includes(q.type as QuestionType)) {
        return NextResponse.json(
          { error: "Invalid question type" },
          { status: 400 }
        );
      }
    }
    const form = await prisma.requirementForm.create({
      //@ts-ignore
      data: {
        postId: postIdInt,
        creatorId: userIdInt,
        questions: {
          create: questions.map((q) => ({
            questionText: q.questionText,
            type: q.type as QuestionType,
            choices: q.type === "MULTIPLE_CHOICE" ? q.choices ?? [] : [],
          })),
        },
      },
      include: { questions: true },
    });

    return NextResponse.json(form, { status: 201 });
  } catch (error) {
    console.error("Error creating form:", error);
    return NextResponse.json(
      { error: "Failed to create form. Please check your request." },
      { status: 500 }
    );
  }
}
