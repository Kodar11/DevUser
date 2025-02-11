"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

type FormType = {
  id: number;
  title: string;
  responses?: {
    id: number;
    questionText: string;
    answer: string;
  }[]; // Optional array of responses
};

export default function DeveloperDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [forms, setForms] = useState<FormType[]>([]);

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user || session.user.role !== "DEVELOPER") {
      router.push("/"); // Redirect unauthorized users
      return;
    }

    const fetchDeveloperForms = async () => {
      try {
        const { data } = await axios.get<{ forms: FormType[] }>("/api/developer");
        setForms(data.forms || []); // Ensure data.forms is always an array
      } catch (error) {
        console.error("Error fetching developer forms:", error);
      }
    };

    fetchDeveloperForms();
  }, [session, status]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Developer Dashboard</h1>

      {forms.length === 0 ? (
        <p className="text-gray-600">No forms created yet.</p>
      ) : (
        <div className="space-y-4">
          {forms.map((form) => (
            <div key={form.id} className="border p-4 rounded-lg bg-gray-100">
              <h2 className="text-lg font-semibold">{form.title}</h2>
              <p className="text-sm text-gray-600">
                Responses: {form.responses?.length ?? 0} {/* Safe check */}
              </p>

              {form.responses?.length && (
                <div className="mt-2">
                  {form.responses.map((response) => (
                    <div key={response.id} className="p-2 border rounded mt-2">
                      <p className="text-sm font-medium">
                        <strong>Q:</strong> {response.questionText}
                      </p>
                      <p className="text-sm">
                        <strong>A:</strong> {response.answer}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* ✅ View Form Button with Next.js <Link> */}
              <Link href={`/formdetails?id=${form.id}`}>
                <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                  View Form
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
