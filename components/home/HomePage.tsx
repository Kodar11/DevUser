"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type Comment = {
  id: number;
  content: string;
  likes: number;
  dislikes: number;
  commenter: {
    username: string;
  };
};

type Post = {
  id: number;
  problemTitle: string;
  description: string;
  upvote: number;
  author: {
    username: string;
  };
  comments: Comment[];
};

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get("/api/posts");
      setPosts(data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (postId: number) => {
    try {
      await axios.post(`/api/posts/${postId}/upvote`);
      fetchPosts(); // Refresh the posts
    } catch (error) {
      console.error("Error upvoting post:", error);
    }
  };

  const handleAddComment = async (postId: number, content: string) => {
    try {
      await axios.post(`/api/posts/${postId}/comment`, { content });
      fetchPosts(); // Refresh the posts
    } catch (error) {
      console.error("Error adding comment:", error);
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
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => handleUpvote(post.id)}
              className="text-green-500 hover:text-green-700 font-semibold"
            >
              Upvote ({post.upvote})
            </button>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-medium">Comments</h3>
            <ul className="list-disc pl-5">
              {post.comments.map((comment) => (
                <li key={comment.id} className="mt-1">
                  <strong>{comment.commenter.username}:</strong> {comment.content}
                  <span className="ml-2 text-sm text-gray-500">
                    ({comment.likes} likes, {comment.dislikes} dislikes)
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-2">
              <textarea
                placeholder="Add a comment..."
                className="w-full border p-2 rounded"
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
        </div>
      ))}
    </div>
  );
}
