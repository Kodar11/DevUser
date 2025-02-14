"use client";

import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";

type Form = {
  id: number;
  title: string;
};

function FormsListPageHere() {
  const searchParams = useSearchParams();
  const postId = searchParams.get("postId"); // ✅ Extract postId from URL
  const router = useRouter();

  const [forms, setForms] = useState<Form[]>([]);

  useEffect(() => {
    if (!postId) return; 
  
    const fetchForms = async () => {
      try {
        const { data } = await axios.get(`/api/posts/${postId}/forms`); 
        setForms(data.forms || []);
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    };
  
    fetchForms();
  }, [postId]); 

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Available Forms</h1>

      {forms.length === 0 ? (
        <p className="text-gray-600">No forms available for this post.</p>
      ) : (
        <div className="space-y-3">
          {forms.map((form) => (
            <div
              key={form.id}
              className="border p-4 rounded-lg hover:bg-gray-100 cursor-pointer"
              onClick={() => router.push(`/answerform?formId=${form.id}&postId=${postId}`)}

            >
              <h2 className="text-lg font-semibold">{form.title}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FormsListPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <FormsListPageHere />
    </Suspense>
  );
}
