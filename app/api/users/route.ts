import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma/userService"

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, password } = body;

  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password, // Include the password here
      },
    });

    return NextResponse.json(
      { message: "User added successfully", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to add user" }, { status: 500 });
  }
}


export async function GET(req: Request) {
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
  const { id, name, email, password } = body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        // password,
      },
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

