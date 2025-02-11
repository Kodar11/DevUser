import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/userService";
import { getServerSession } from "next-auth/next";
import { NEXT_AUTH_CONFIG } from "@/lib/nextAuthConfig";
import { scrapeSolutions } from "@/lib/scraper"; // Import the scraper function
import { SolutionSourceType } from "@prisma/client"; // Import the enum


export async function POST(req: Request) {
  const session = await getServerSession(NEXT_AUTH_CONFIG);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }


  const userId = session.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "User ID not found in session" }, { status: 401 });
  }

  const body = await req.json();
  const { problemTitle, description, tags, status } = body;

  if (!problemTitle || !description) {
    return NextResponse.json({ error: "Problem title and description are required" }, { status: 400 });
  }

  try {
    // Step 1: Create the problem post
    const problem = await prisma.post.create({
      data: {
        problemTitle,
        description,
        tags: tags || [],
        status: status || "OPEN",
        authorId: userId,
      },
    });

    // Step 2: Scrape solutions
    const scrapedSolutions = await scrapeSolutions(problemTitle, description);

    if (!scrapedSolutions || scrapedSolutions.length === 0) {
      console.warn("No solutions found from scraping.");
    }

    // Step 3: Store scraped solutions in the database using createMany() to avoid unique constraint errors
    const solutionRecords = scrapedSolutions
      .filter(sol => sol.link) // Filter out invalid solutions
      .map(sol => ({
        postId: problem.id,
        sourceType: SolutionSourceType.WEB_SCRAPED,
        solutionText: sol.snippet || "No description available",
        solutionLink: sol.link,
        confidenceScore: Math.random() * 10, // Assign a random confidence score
      }))
      .sort((a, b) => b.confidenceScore - a.confidenceScore) // Sort solutions in descending order of confidenceScore
      .slice(0, 5); // Take only the top 5 solutions

    if (solutionRecords.length > 0) {
      await prisma.solution.createMany({
        data: solutionRecords,
        skipDuplicates: true, // Avoid duplicate insertions
      });
    }

    return NextResponse.json(
      { message: "Problem created successfully", problem, solutions: solutionRecords },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating problem:", error);
    return NextResponse.json({ error: "Failed to create problem" }, { status: 500 });
  }
}


// Fetch all posts with comments and solutions
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: { select: { id: true, username: true } },
        comments: {
          include: {
            commenter: { select: { id: true, username: true } },
            childComments: {
              include: { commenter: { select: { id: true, username: true } } },
            },
          },
        },
        Solution: {
          orderBy: { confidenceScore: "desc" },
          include: { submittedBy: { select: { id: true, username: true } } },
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
