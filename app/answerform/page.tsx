"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";

export default function SubmitResponsePage() {
    const searchParams = useSearchParams();
    const formId = searchParams.get("formId");
    const postId = searchParams.get("postId");
    const router = useRouter();

    const [form, setForm] = useState(null);
    const [responses, setResponses] = useState<Record<number, string>>({});

    useEffect(() => {
        if (!formId || !postId) return;

        const fetchForm = async () => {
            try {
                const { data } = await axios.get(`/api/posts/${postId}/forms/${formId}/responses`);
                setForm(data);
            } catch (error) {
                console.error("Error fetching form details:", error);
            }
        };

        fetchForm();
    }, [formId, postId]);

    const handleChange = (questionId: number, value: string) => {
        setResponses((prev) => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async () => {
        try {
            const formattedResponses = Object.entries(responses).map(([questionId, answer]) => ({
                questionId: Number(questionId),
                answer,
            }));

            await axios.post(`/api/posts/${postId}/forms/${formId}/responses`, {
                responses: formattedResponses,
            });

            alert("Response submitted successfully!");
            router.push("/");
        } catch (error) {
            console.error("Error submitting response:", error);
            alert("Failed to submit response. Please try again.");
        }
    };

    if (!form) return <p>Loading form...</p>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{
                //@ts-ignore

                form.title}</h1>
            {
                //@ts-ignore

                form.questions.map((question: { id: number; questionText: string; type: string; choices?: string[] }) => (
                    <div key={question.id} className="mb-4">
                        <label className="block font-semibold">{question.questionText}</label>
                        {question.type === "TEXT" ? (
                            <input
                                type="text"
                                value={responses[question.id] || ""}
                                onChange={(e) => handleChange(question.id, e.target.value)}
                                className="w-full p-2 border rounded mt-2"
                            />
                        ) : (
                            <select
                                value={responses[question.id] || ""}
                                onChange={(e) => handleChange(question.id, e.target.value)}
                                className="w-full p-2 border rounded mt-2"
                            >
                                <option value="">Select an option</option>
                                {question.choices?.map((choice, index) => (
                                    <option key={index} value={choice}>{choice}</option>
                                ))}
                            </select>
                        )}
                    </div>
                ))}
            <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
                Submit Response
            </button>
        </div>
    );
}
