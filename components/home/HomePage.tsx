"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

type ChildComment = {
  id: number;
  content: string;
  commenter: {
    username: string;
  };
};

type Comment = {
  id: number;
  content: string;
  likes: number;
  dislikes: number;
  commenter: {
    username: string;
  };
  childComments: ChildComment[];
};

type Solution = {
  id: number;
  solutionText: string;
  solutionLink?: string;
  confidenceScore: number;
};

type Post = {
  id: number;
  problemTitle: string;
  description: string;
  upvoteCount: number;
  author: {
    username: string;
  };
  comments: Comment[];
  Solution: Solution[];
};

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get("/api/posts");
      setPosts(data.posts || []);

    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (id: number, content: string) => {
    try {
      await axios.post(`/api/posts/${id}/comment`, { content });
      fetchPosts();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleAddChildComment = async (
    postId: number,
    parentCommentId: number,
    content: string
  ) => {
    try {
      await axios.post(`/api/posts/${postId}/comment/${parentCommentId}`, { content });
      fetchPosts();
    } catch (error) {
      console.error("Error adding child comment:", error);
    }
  };

  const handleUpvote = async (postId: number) => {
    try {
      const { data } = await axios.post(`/api/posts/${postId}/upvote`);
      fetchPosts();
    } catch (error) {
      console.error("Error upvoting post:", error);
    }
  };

  const handleLike = async (postId: number, commentId: number) => {
    try {
      await axios.post(`/api/posts/${postId}/comment/${commentId}/like`);
      fetchPosts();
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleDislike = async (postId: number, commentId: number) => {
    try {
      await axios.post(`/api/posts/${postId}/comment/${commentId}/dislike`);
      fetchPosts();
    } catch (error) {
      console.error("Error disliking comment:", error);
    }
  };



  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Problems</h1>
      {posts.map((post) => (
        <div key={post.id} className="border rounded-lg p-4 mb-4 shadow">
          <h2 className="text-xl font-semibold">{post.problemTitle}</h2>
          <p className="text-gray-700 mb-2">{post.description}</p>
          <p className="text-sm text-gray-500">Posted by: {post.author.username}</p>
          <div className="flex items-center mt-4">
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
              onClick={() => handleUpvote(post.id)}
            >
              Upvote
            </button>
            <span>{post.upvoteCount} Upvotes</span>
          </div>

          {/* Add Solution Button */}
          <Link href={`/addsolution?id=${post.id}`}>
            <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mt-2">
              Add Solution
            </button>
          </Link>

          {/* Display Solutions */}
          <div className="mt-4">
            <h3 className="text-lg font-medium">Solutions</h3>
            {post.Solution && post.Solution.length > 0  ? (
              <ul className="list-disc pl-5">
                {post.Solution.map((solution) => (
                  <li key={solution.id} className="mt-2">
                    <p>{solution.solutionText}</p>
                    {solution.solutionLink && (
                      <Link
                        href={solution.solutionLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        View Solution
                      </Link> 
                    )}
                    <p className="text-sm text-gray-500">Confidence Score: {solution.confidenceScore}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No solutions available yet.</p>
            )}
          </div>


          <div className="mt-4">
            <h3 className="text-lg font-medium">Comments</h3>
            <ul className="list-disc pl-5">
              {post.comments.map((comment) => (
                <li key={comment.id} className="mt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong>{comment.commenter.username}:</strong> {comment.content}
                    </div>
                    {/* Like and Dislike Buttons */}
                    <div className="flex items-center space-x-2">
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        onClick={() => handleLike(post.id, comment.id)}
                      >
                        👍 {comment.likes}
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        onClick={() => handleDislike(post.id, comment.id)}
                      >
                        👎 {comment.dislikes}
                      </button>
                    </div>
                  </div>

                  {/* Child Comments */}
                  <ul className="list-disc pl-5 mt-2">
                    {comment.childComments.map((child) => (
                      <li key={child.id}>
                        <strong>{child.commenter.username}:</strong> {child.content}
                      </li>
                    ))}
                  </ul>

                  {/* Add Child Comment Input */}
                  <textarea
                    placeholder="Reply to this comment..."
                    className="w-full border p-2 rounded mt-2"
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        const content = e.currentTarget.value.trim();
                        if (content) {
                          handleAddChildComment(post.id, comment.id, content);
                          e.currentTarget.value = "";
                        }
                      }
                    }}
                  ></textarea>
                </li>
              ))}
            </ul>

            {/* Add Parent Comment Input */}
            <textarea
              placeholder="Add a comment..."
              className="w-full border p-2 rounded mt-4"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  const content = e.currentTarget.value.trim();
                  if (content) {
                    handleAddComment(post.id, content);
                    e.currentTarget.value = "";
                  }
                }
              }}
            ></textarea>
          </div>
        </div>
      ))}
    </div>
  );
}