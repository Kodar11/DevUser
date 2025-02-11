import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/userService";
import { getServerSession } from "next-auth/next";
import { NEXT_AUTH_CONFIG } from "@/lib/nextAuthConfig";

interface Params {
  id: string;
}

export async function GET(req: Request, { params }: { params: Params }) {
  try {
    console.log("🔹 API Request Received: GET /api/developer/[id]");

    // ✅ Fetch session
    const session = await getServerSession(NEXT_AUTH_CONFIG);
    console.log("🔍 Session Data:", session);

    if (!session?.user) {
      console.error("⛔ Unauthorized: No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const developerId = session.user.id; // ✅ FIXED: No need for parseInt
    console.log(`👨‍💻 Developer ID: ${developerId}`);

    if (isNaN(developerId)) {
      console.error("⛔ Invalid Developer ID:", session.user?.id);
      return NextResponse.json({ error: "Invalid developer ID" }, { status: 400 });
    }

    console.log(`📌 Fetching forms created by Developer ID: ${developerId}`);

    // ✅ Fetch all forms created by the developer, including responses
    const forms = await prisma.requirementForm.findMany({
      where: { creatorId: developerId },
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
      orderBy: { createdAt: "desc" },
    });

    console.log(`✅ Found ${forms.length} Forms for Developer ID ${developerId}`);

    return NextResponse.json({ forms }, { status: 200 });
  } catch (error: unknown) {
    console.error("🚨 Error Fetching Developer Forms & Responses:", error);
    return NextResponse.json(
      { error: "Failed to fetch developer forms." },
      { status: 500 }
    );
  }
}
