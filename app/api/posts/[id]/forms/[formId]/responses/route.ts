import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/userService";
import { getServerSession } from "next-auth/next";
import { NEXT_AUTH_CONFIG } from "@/lib/nextAuthConfig";

export async function POST(
  req: Request,
  context: { params: { id: string; formId: string } }
) {
  try {
    console.log("🔹 API Request Received: POST /api/posts/[id]/forms/[formId]/responses");

    // ✅ Step 1: Extract params
    const { id, formId } = context.params;
    console.log(`📌 Extracted Post ID: ${id}, Form ID: ${formId}`);

    // ✅ Step 2: Fetch session
    const session = await getServerSession(NEXT_AUTH_CONFIG);
    console.log("🔍 Session Data:", session);

    if (!session) {
      console.error("⛔ Unauthorized: No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    //@ts-ignore
    const userId = session.user?.id;
    console.log(`👤 User ID: ${userId}`);

    // ✅ Step 3: Convert IDs to integers
    const userIdInt = parseInt(userId);
    const postIdInt = parseInt(id);
    const formIdInt = parseInt(formId);

    if (isNaN(postIdInt) || isNaN(formIdInt)) {
      console.error("⛔ Invalid IDs:", { postId: id, formId });
      return NextResponse.json({ error: "Invalid postId or formId" }, { status: 400 });
    }

    console.log(`🔢 Parsed Post ID: ${postIdInt}, Form ID: ${formIdInt}, User ID: ${userIdInt}`);

    // ✅ Step 4: Parse Request Body
    const body = await req.json();
    console.log("📩 Request Body:", body);

    const { responses } = body;

    // ✅ Step 5: Validate Responses
    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      console.error("⛔ Invalid Responses Format:", responses);
      return NextResponse.json(
        { error: "Invalid responses format" },
        { status: 400 }
      );
    }

    for (const response of responses) {
      if (typeof response.answer !== "string" || isNaN(parseInt(response.questionId))) {
        console.error("⛔ Invalid Response Object:", response);
        return NextResponse.json(
          { error: "Invalid response format", received: response },
          { status: 400 }
        );
      }
    }

    console.log("✅ All responses validated successfully");

    // ✅ Step 6: Store Responses in Database
    console.log("🛠 Storing Responses...");
    const createdResponses = await prisma.response.createMany({
      data: responses.map((r) => ({
        userId: userIdInt,
        questionId: parseInt(r.questionId),
        answer: r.answer,
        formId: formIdInt,
      })),
    });

    console.log("✅ Responses Stored Successfully:", createdResponses);

    return NextResponse.json({ message: "Responses submitted successfully!" }, { status: 201 });
  } catch (error) {
    console.error("🚨 Error Submitting Responses:", error);
    return NextResponse.json(
      { error: "Failed to submit responses. Please check your request." },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  context: { params: { id: string; formId: string } }
) {
  try {
    console.log("🔹 API Request Received: GET /api/posts/[id]/forms/[formId]");

    // ✅ Step 1: Extract params
    const { id, formId } = context.params;
    console.log(`📌 Extracted Post ID: ${id}, Form ID: ${formId}`);

    // ✅ Step 2: Convert IDs to integers
    const postIdInt = parseInt(id);
    const formIdInt = parseInt(formId);

    if (isNaN(postIdInt) || isNaN(formIdInt)) {
      console.error("⛔ Invalid IDs:", { postId: id, formId });
      return NextResponse.json({ error: "Invalid postId or formId" }, { status: 400 });
    }

    console.log(`🔢 Parsed Post ID: ${postIdInt}, Form ID: ${formIdInt}`);

    // ✅ Step 3: Fetch the form with its questions
    console.log("🛠 Fetching Form Details...");
    const form = await prisma.requirementForm.findUnique({
      where: { id: formIdInt },
      include: {
        questions: true, // ✅ Include questions in response
      },
    });

    if (!form) {
      console.error("⛔ Form not found");
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    console.log("✅ Form Fetched Successfully:", form);

    return NextResponse.json(form, { status: 200 });
  } catch (error) {
    console.error("🚨 Error Fetching Form:", error);
    return NextResponse.json(
      { error: "Failed to fetch form. Please try again later." },
      { status: 500 }
    );
  }
}