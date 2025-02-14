"use client";

import { useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";

function AddProblemHere() {
  const { data: session } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    problemTitle: "",
    description: "",
    tags: [] as string[],
    status: "OPEN",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (tag: string) => {
    setFormData((prev) => {
      const updatedTags = prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag) // Remove tag if already selected
        : [...prev.tags, tag]; // Add tag if not selected
      return { ...prev, tags: updatedTags };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { problemTitle, description, tags, status } = formData;

    if (!problemTitle || !description) {
      setError("Problem title and description are required.");
      setLoading(false);
      return;
    }

    try {
      await axios.post("/api/posts", {
        problemTitle,
        description,
        tags,
        status,
      });

      setFormData({
        problemTitle: "",
        description: "",
        tags: [],
        status: "OPEN",
      });
      router.push("/");
    } catch (err) {
      if(err instanceof Error){

        setError(err.message || "An error occurred while creating the problem.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return <p className="text-center text-gray-600 mt-6">You must be logged in to submit a problem.</p>;
  }

  const tagOptions = ["BUG", "FEATURE_REQUEST", "PERFORMANCE", "UI", "SECURITY"];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-200">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Add a Problem</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="problemTitle"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Problem Title
          </label>
          <input
            type="text"
            name="problemTitle"
            id="problemTitle"
            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring focus:ring-indigo-200 focus:outline-none"
            value={formData.problemTitle}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={5}
            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring focus:ring-indigo-200 focus:outline-none"
            value={formData.description}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
          <div className="grid grid-cols-2 gap-4">
            {tagOptions.map((tag) => (
              <div key={tag} className="flex items-center">
                <input
                  type="checkbox"
                  id={tag}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring focus:ring-indigo-200"
                  checked={formData.tags.includes(tag)}
                  onChange={() => handleTagChange(tag)}
                />
                <label
                  htmlFor={tag}
                  className="ml-2 text-sm font-medium text-gray-700"
                >
                  {tag}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            name="status"
            id="status"
            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring focus:ring-indigo-200 focus:outline-none"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="OPEN">Open</option>
            <option value="SOLVED">Solved</option>
          </select>
        </div>

        <button
          type="submit"
          className={`w-full px-4 py-3 text-white font-medium bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:ring focus:ring-indigo-200 focus:outline-none ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Problem"}
        </button>
      </form>
    </div>
  );
};

export default function AddProblem() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AddProblemHere />
    </Suspense>
  );
}
