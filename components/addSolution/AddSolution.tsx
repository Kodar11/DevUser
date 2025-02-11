"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function AddSolution() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = parseInt(searchParams.get("id") || "0", 10); // Get the post ID from the URL query

  const [solutionText, setSolutionText] = useState("");
  const [solutionLink, setSolutionLink] = useState("");
  const [confidenceScore, setConfidenceScore] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(`/api/posts/${postId}/solutions`, {
        solutionText,
        solutionLink,
        confidenceScore: parseFloat(confidenceScore) || 0,
      });
      router.push("/"); // Redirect back to homepage after submission
    } catch (error) {
      console.error("Error adding solution:", error);
      setError("Failed to add solution. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add a Solution</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full border p-2 rounded"
          placeholder="Describe your solution..."
          value={solutionText}
          onChange={(e) => setSolutionText(e.target.value)}
          required
        ></textarea>

        <input
          type="url"
          className="w-full border p-2 rounded"
          placeholder="Link to solution (optional)"
          value={solutionLink}
          onChange={(e) => setSolutionLink(e.target.value)}
        />

        <input
          type="number"
          className="w-full border p-2 rounded"
          placeholder="Confidence Score (0-100)"
          value={confidenceScore}
          onChange={(e) => setConfidenceScore(e.target.value)}
          min="0"
          max="100"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Solution"}
        </button>
      </form>
    </div>
  );
}
