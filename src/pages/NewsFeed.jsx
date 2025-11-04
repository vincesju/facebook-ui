import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://facebook-api-wlaf.onrender.com/api/posts";

const NewsFeed = () => {
  const [posts, setPosts] = useState([]);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const response = await axios.get(API_URL);
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Create post
  const createPost = async (e) => {
    e.preventDefault();
    if (!author || !content) return;

    try {
      await axios.post(API_URL, { author, content, imageUrl });
      setAuthor("");
      setContent("");
      setImageUrl("");
      fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
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
            <button type="submit">Post</button>
          </form>
        </div>

        <div className="posts">
          <h2>News Feed</h2>
          {posts.length === 0 ? (
            <p>No posts yet</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="post">
                <div className="post-header">
                  <strong>{post.author}</strong>
                  <span>{new Date(post.createdDate).toLocaleDateString()}</span>
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