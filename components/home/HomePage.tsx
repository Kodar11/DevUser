import { useEffect, useState } from "react";
import axios from "axios";

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

type Post = {
  id: number;
  problemTitle: string;
  description: string;
  upvoteCount: number;
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

  const handleAddComment = async (id: number, content: string) => {
    try {
      console.log("Post Id : ",id);
      console.log("Content : ",content);
      
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

          <div className="mt-4">
            <h3 className="text-lg font-medium">Comments</h3>
            <ul className="list-disc pl-5">
              {post.comments.map((comment) => (
                <li key={comment.id} className="mt-2">
                  <strong>{comment.commenter.username}:</strong> {comment.content}
                  <ul className="list-disc pl-5 mt-2">
                    {comment.childComments.map((child) => (
                      <li key={child.id}>
                        <strong>{child.commenter.username}:</strong> {child.content}
                      </li>
                    ))}
                  </ul>
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
