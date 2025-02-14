"use client";
import { useState, Suspense } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

// Define the types for the questions and the form
type Question = {
  questionText: string;
  type: "TEXT" | "MULTIPLE_CHOICE"; // Restrict type to valid values
  choices: string[]; // Ensure choices is a string array
};

function CreateFormContent() {
  const router = useRouter();
  const searchParams1 = useSearchParams();
  const id = searchParams1.get("postId");

  const [formTitle, setFormTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { questionText: "", type: "TEXT", choices: [] }, // Initialize with correct type
  ]);

  const addQuestion = () => {
    setQuestions([...questions, { questionText: "", type: "TEXT", choices: [] }]);
  };

  const updateQuestion = (index: number, key: keyof Question, value: string | string[]) => {
    const updatedQuestions = [...questions];
    
    if (key === "type") {
      // Ensure value is either 'TEXT' or 'MULTIPLE_CHOICE'
      updatedQuestions[index][key] = value === "TEXT" || value === "MULTIPLE_CHOICE" ? value : updatedQuestions[index][key];
    } else if (key === "choices" && Array.isArray(value)) {
      // If updating 'choices', make sure it's an array of strings
      updatedQuestions[index][key] = value;
    } else if (key === "questionText" && typeof value === "string") {
      // Ensure 'questionText' is a string
      updatedQuestions[index][key] = value;
    }
    
    setQuestions(updatedQuestions);
  };
  
  
  
  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].choices[oIndex] = value; // Ensure choices are updated
    setQuestions(updatedQuestions);
  };
  
  

  const addOption = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].choices.push(""); // Ensure choices is updated correctly
    setQuestions(updatedQuestions);
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].choices.splice(oIndex, 1); // Ensure choices are removed correctly
    setQuestions(updatedQuestions);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async () => {
    try {
      // Validate that all questions have valid text
      const formattedQuestions = questions
        .filter((q) => q.questionText.trim() !== "")
        .map((q) => ({
          questionText: q.questionText.trim(),
          type: q.type.toUpperCase(), // Ensure correct type formatting
          choices: q.type === "MULTIPLE_CHOICE" ? q.choices.filter((c) => c.trim() !== "") : [],
        }));

      if (formattedQuestions.length === 0) {
        alert("Please add at least one valid question before submitting.");
        return;
      }

      await axios.post(`/api/posts/${id}/forms`, {
        title: formTitle.trim(),
        questions: formattedQuestions,
      });

      alert("Form created successfully!");
      router.push("/");
    } catch (error) {
      console.error("Error creating form", error);
      alert("Failed to create form. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Requirement Form</h1>
      <input
        type="text"
        placeholder="Form Title"
        value={formTitle}
        onChange={(e) => setFormTitle(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      {questions.map((question, qIndex) => (
        <div key={qIndex} className="mb-4 p-4 border rounded">
          <input
            type="text"
            placeholder="Question text"
            value={question.questionText}
            onChange={(e) => updateQuestion(qIndex, "questionText", e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />

          <select
            value={question.type}
            onChange={(e) => updateQuestion(qIndex, "type", e.target.value)}
            className="w-full p-2 border rounded mt-2"
          >
            <option value="TEXT">Text Answer</option>
            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
          </select>

          {question.type === "MULTIPLE_CHOICE" && (
            <div className="mt-2">
              {question.choices.map((option, oIndex) => (
                <div key={oIndex} className="flex items-center mb-2">
                  <input
                    type="text"
                    placeholder={`Option ${oIndex + 1}`}
                    value={option}
                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                  <button
                    onClick={() => removeOption(qIndex, oIndex)}
                    className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => addOption(qIndex)}
                className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
              >
                Add Option
              </button>
            </div>
          )}

          <button
            onClick={() => removeQuestion(qIndex)}
            className="bg-red-500 text-white px-3 py-1 rounded mt-2"
          >
            Remove Question
          </button>
        </div>
      ))}

      <button onClick={addQuestion} className="bg-green-500 text-white px-3 py-1 rounded mt-2">
        Add Question
      </button>
      <button onClick={handleSubmit} className="bg-purple-500 text-white px-3 py-1 rounded mt-2 ml-2">
        Submit Form
      </button>
    </div>
  );
}

export default function CreateForm() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <CreateFormContent />
    </Suspense>
  );
}
