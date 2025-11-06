import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://facebook-api-wlaf.onrender.com/api/posts";

const NewsFeed = () => {
  const [posts, setPosts] = useState([]);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(API_URL);
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const createPost = async (e) => {
    e.preventDefault();
    if (!author || !content) return;

    setLoading(true);
    try {
      await axios.post(API_URL, { author, content, imageUrl });
      setAuthor("");
      setContent("");
      setImageUrl("");
      fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
    }
    setLoading(false);
  };

  const deletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      console.log("Deleting post with ID:", postId);
      const response = await axios.delete(`${API_URL}/${postId}`);
      console.log("Delete response:", response);
      fetchPosts(); // Refresh the posts list
    } catch (error) {
      console.error("Error deleting post:", error);
      console.error("Error details:", error.response?.data);
      alert("Failed to delete post. Please try again.");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="newsfeed">
      <header className="header">
        <h1>Facebook</h1>
      </header>

      <div className="container">
        {/* Create Post */}
        <div className="create-post">
          <h2>Create Post</h2>
          <form onSubmit={createPost}>
            <input
              type="text"
              placeholder="Your Name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
            <textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Image URL (optional)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Posting..." : "Post"}
            </button>
          </form>
        </div>

        {/* Posts Feed */}
        <div className="posts">
          <h2>News Feed ({posts.length} posts)</h2>
          {posts.length === 0 ? (
            <div className="no-posts">
              <p>No posts yet. Be the first to share something!</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="post">
                <div className="post-header">
                  <div>
                    <strong>{post.author}</strong>
                    <span className="post-time">
                      {new Date(post.createdDate).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => deletePost(post.id)}
                    title="Delete post"
                  >
                    ×
                  </button>
                </div>
                <p>{post.content}</p>
                {post.imageUrl && (
                  <img src={post.imageUrl} alt="Post" className="post-image" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsFeed;