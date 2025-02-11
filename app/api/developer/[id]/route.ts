import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/userService";
import { getServerSession } from "next-auth/next";
import { NEXT_AUTH_CONFIG } from "@/lib/nextAuthConfig";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    console.log(`🔹 API Request Received: GET /api/developer/${params.id}`);

    // ✅ Fetch session
    const session = await getServerSession(NEXT_AUTH_CONFIG);
    console.log("🔍 Session Data:", session);

    if (!session?.user) {
      console.error("⛔ Unauthorized: No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    const developerId = session.user.id;
    console.log(`👨‍💻 Developer ID: ${developerId}`);

    if (isNaN(developerId)) {
      console.error("⛔ Invalid Developer ID:", session.user?.id);
      return NextResponse.json({ error: "Invalid developer ID" }, { status: 400 });
    }

    const formId = parseInt(params.id);
    if (isNaN(formId)) {
      console.error("⛔ Invalid Form ID:", params.id);
      return NextResponse.json({ error: "Invalid form ID" }, { status: 400 });
    }

    console.log(`📌 Fetching form ID: ${formId} created by Developer ID: ${developerId}`);

    // ✅ Fetch the specific form with its responses
    const form = await prisma.requirementForm.findUnique({
      where: { id: formId, creatorId: developerId },
      select: {
        id: true,
        title: true,
        createdAt: true,
        questions: {
          select: {
            id: true,
            questionText: true,
          },
        },
        Response: {
          select: {
            id: true,
            answer: true,
            user: {
              select: { id: true, username: true },
            },
            question: {
              select: {
                id: true,
                questionText: true,
              },
            },
          },
        },
      },
    });

    if (!form) {
      console.error("🚫 Form Not Found or Unauthorized");
      return NextResponse.json({ error: "Form not found or unauthorized" }, { status: 404 });
    }

    console.log(`✅ Form ID ${formId} retrieved successfully`);

    return NextResponse.json({ form }, { status: 200 });
  } catch (error) {
    console.error("🚨 Error Fetching Form Details:", error);
    return NextResponse.json(
      { error: "Failed to fetch form details." },
      { status: 500 }
    );
  }
}
