import { NextResponse } from "next/server";

let users = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Doe", email: "jane@example.com" },
];

export async function GET() {
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const { name, email } = await req.json();
  const newUser = { id: Date.now(), name, email };
  users.push(newUser);
  return NextResponse.json(newUser);
}
