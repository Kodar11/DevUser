import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/userService";
import bcrypt from "bcrypt";

const saltRounds = 10;

export async function POST(req: Request) {
  const body = await req.json();
  const { username, email, password } = body;

  if (!username || !email || !password) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword, // Save the hashed password
      },
    });

    return NextResponse.json(
      { message: "User added successfully", user: newUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to add user" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json({ message: "Fetched successfully", users }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, username, email, password } = body;

  if (!id || !username || !email) {
    return NextResponse.json({ error: "ID, username, and email are required" }, { status: 400 });
  }

  try {
    const updatedData: { username: string; email: string; password?: string } = { username, email };

    if (password) {
      updatedData.password = await bcrypt.hash(password, saltRounds);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updatedData,
    });

    return NextResponse.json({ message: "User updated successfully", user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}


export async function DELETE(req: Request) {
  const body = await req.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    await prisma.user.delete({
      where: { id },
    });

    // Return a 204 status for successful deletion with no content
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
