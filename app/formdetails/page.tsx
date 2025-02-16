"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

type FormDetails = {
  id: number;
  title: string;
  createdAt: string;
  questions: { id: number; questionText: string }[];
  Response: {
    id: number;
    answer: string;
    user: { id: number; username: string };
    question: { id: number; questionText: string };
  }[];
};

function FormDetailsPageHere() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [form, setForm] = useState<FormDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Invalid form ID.");
      setLoading(false);
      return;
    }

    const fetchFormDetails = async () => {
      try {
        const { data } = await axios.get(`/api/developer/${id}`);
        setForm(data.form ?? null);
      } catch (err) {
        console.error("Error fetching form details:", err);
        setError("Failed to load form.");
      } finally {
        setLoading(false);
      }
    };

    fetchFormDetails();
  }, [id]);

  if (!id) return <p className="text-center text-red-500">Invalid form ID.</p>;
  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!form) return <p className="text-center text-red-500">Form not found.</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-3">{form.title}</h1>
      <p className="text-gray-500 text-sm mb-4">
        Created on: {new Date(form.createdAt).toLocaleDateString()}
      </p>

      <div className="space-y-6">
        {form.questions.map((question) => (
          <div key={question.id} className="border p-4 rounded-lg bg-gray-50 shadow-sm">
            <h2 className="text-lg font-semibold">Q: {question.questionText}</h2>

            <div className="mt-2 space-y-2">
              {form.Response?.filter((resp) => resp.question.id === question.id).length === 0 ? (
                <p className="text-gray-500 text-sm">No responses yet.</p>
              ) : (
                form.Response?.filter((resp) => resp.question.id === question.id).map((response) => (
                  <div key={response.id} className="p-3 border rounded bg-white shadow-sm">
                    <p>
                      <strong className="text-blue-600">{response.user.username}:</strong> {response.answer}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FormDetailsPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <FormDetailsPageHere />
    </Suspense>
  );
}