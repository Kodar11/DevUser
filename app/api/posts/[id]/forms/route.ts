import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/userService";
import { getServerSession } from "next-auth/next";
import { NEXT_AUTH_CONFIG } from "@/lib/nextAuthConfig";


export async function POST(req: Request, context: { params: { id: string } }) {
  try {
    console.log("🔹 API Request Received: POST /api/posts/[id]/forms");

    // ✅ Step 1: Extract params
    const { id } = context.params;
    console.log(`📌 Extracted Post ID: ${id}`);

    // ✅ Step 2: Fetch session
    const session = await getServerSession(NEXT_AUTH_CONFIG);
    console.log("🔍 Session Data:", session);

    if (!session) {
      console.error("⛔ Unauthorized: No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    const userId = session.user?.id;
    const userRole = session.user?.role;

    console.log(`👤 User ID: ${userId}, Role: ${userRole}`);

    // ✅ Step 3: Check user role
    if (!userId || userRole !== "DEVELOPER") {
      console.error("⛔ Forbidden: User is not a DEVELOPER");
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ✅ Step 4: Convert IDs to integers

    const postIdInt = parseInt(id);

    if (isNaN(postIdInt)) {
      console.error("⛔ Invalid Post ID:", id);
      return NextResponse.json({ error: "Invalid postId" }, { status: 400 });
    }

    console.log(`🔢 Parsed Post ID: ${postIdInt}, User ID: ${userId}`);

    // ✅ Step 5: Parse Request Body
    const body = await req.json();
    console.log("📩 Request Body:", body);

    const { title, questions } = body;

    // ✅ Step 6: Validate Title
    if (!title || typeof title !== "string") {
      console.error("⛔ Invalid Title:", title);
      return NextResponse.json({ error: "Invalid title" }, { status: 400 });
    }

    console.log(`📌 Title: ${title}`);

    // ✅ Step 7: Validate Questions
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      console.error("⛔ Invalid Questions Format:", questions);
      return NextResponse.json(
        { error: "Invalid questions format" },
        { status: 400 }
      );
    }
    
    for (const q of questions) {
      if (typeof q.questionText !== "string") {
        console.log(q.questionText);
        
        console.error("⛔ Invalid Question Object:", q);
        return NextResponse.json(
          { error: "Invalid questionText in questions", received: q },
          { status: 400 }
        );
      }
    }

    console.log("✅ All questions validated successfully");

    // ✅ Step 8: Create Requirement Form in Database
    console.log("🛠 Creating Requirement Form...");
    const form = await prisma.requirementForm.create({
      data: {
        title, // ✅ Ensure title is stored
        postId: postIdInt,
        creatorId: userId,
        questions: {
          create: questions.map((q) => ({
            questionText: q.questionText,
            type: "TEXT",
            choices: Array.isArray(q.choices) ? q.choices : [], // ✅ Ensure array
          })),
        },
      },
    });

    console.log("✅ Form Created Successfully:", form);

    return NextResponse.json(form, { status: 201 });
  } catch (error) {
    console.error("🚨 Error Creating Form:", error);
    return NextResponse.json(
      { error: "Failed to create form. Please check your request." },
      { status: 500 }
    );
  }
}


// ✅ GET: Fetch all requirement forms linked to a post
export async function GET(req: Request, context: { params: { id: string } }) {
  try {
    console.log("🔹 API Request Received: GET /api/posts/[id]/forms");

    // ✅ Extract post ID from URL params
    const { id } = context.params;
    const postIdInt = parseInt(id);

    if (isNaN(postIdInt)) {
      console.error("⛔ Invalid Post ID:", id);
      return NextResponse.json({ error: "Invalid postId" }, { status: 400 });
    }

    console.log(`📌 Checking if post exists for Post ID: ${postIdInt}`);

    // ✅ Ensure the post exists
    const post = await prisma.post.findUnique({
      where: { id: postIdInt },
    });

    if (!post) {
      console.error("⛔ No post found with ID:", postIdInt);
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    console.log(`✅ Post found: ${post.id}`);

    // ✅ Fetch all forms associated with the post, including the new `title` field
    console.log(`📌 Fetching forms for Post ID: ${postIdInt}`);

    const forms = await prisma.requirementForm.findMany({
      where: { postId: postIdInt },
      select: {
        id: true,
        title: true, // ✅ Now fetching the title
        questions: {
          select: {
            id: true,
            questionText: true,
          },
        },
      },
    });

    console.log(`✅ Found ${forms.length} Forms for Post ID ${postIdInt}`);

    return NextResponse.json({ forms }, { status: 200 });
  } catch (error) {
    console.error("🚨 Error Fetching Forms:", error);
    return NextResponse.json(
      { error: "Failed to fetch forms." },
      { status: 500 }
    );
  }
}

