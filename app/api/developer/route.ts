import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/userService";
import { getServerSession } from "next-auth/next";
import { NEXT_AUTH_CONFIG } from "@/lib/nextAuthConfig";

export async function GET(req: Request) {
  try {
    console.log("🔹 API Request Received: GET /api/developer/forms");

    // ✅ Fetch session
    const session = await getServerSession(NEXT_AUTH_CONFIG);
    console.log("🔍 Session Data:", session);

    if (!session?.user) {
      console.error("⛔ Unauthorized: No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    //@ts-ignore
    const developerId = parseInt(session.user.id);
    console.log(`👨‍💻 Developer ID: ${developerId}`);

    if (isNaN(developerId)) {
        //@ts-ignore
      console.error("⛔ Invalid Developer ID:", session.user.id);
      return NextResponse.json({ error: "Invalid developer ID" }, { status: 400 });
    }

    console.log(`📌 Fetching forms created by Developer ID: ${developerId}`);

    // ✅ Fetch all forms created by the developer with responses
    const forms = await prisma.requirementForm.findMany({
      where: { creatorId: developerId },
      select: {
        id: true,
        title: true,
        questions: {
          select: {
            id: true,
            questionText: true,
            responses: {
              select: {
                id: true,
                answer: true,
                user: {
                  select: { id: true, username: true },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    console.log(`✅ Found ${forms.length} Forms for Developer ID ${developerId}`);

    return NextResponse.json({ forms }, { status: 200 });
  } catch (error) {
    console.error("🚨 Error Fetching Developer Forms & Responses:", error);
    return NextResponse.json(
      { error: "Failed to fetch developer forms." },
      { status: 500 }
    );
  }
}
