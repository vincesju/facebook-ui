import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = "https://facebook-api-wlaf.onrender.com/api/posts";

function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ author: '', content: '', imageUrl: '' });
  const [loading, setLoading] = useState(false);

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      const response = await axios.get(API_URL);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  // Create new post
  const createPost = async (e) => {
    e.preventDefault();
    if (!newPost.author || !newPost.content) return;
    
    setLoading(true);
    try {
      await axios.post(API_URL, newPost);
      setNewPost({ author: '', content: '', imageUrl: '' });
      fetchPosts(); // Refresh posts
    } catch (error) {
      console.error('Error creating post:', error);
    }
    setLoading(false);
  };

  // Delete post
  const deletePost = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchPosts(); // Refresh posts
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  // Load posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="facebook-app">
      {/* Header */}
      <header className="facebook-header">
        <div className="header-content">
          <h1>Facebook</h1>
          <nav>
            <span>Home</span>
            <span>Profile</span>
            <span>Logout</span>
          </nav>
        </div>
      </header>

      <div className="main-container">
        {/* Left Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-item active">
            <span>📱</span> News Feed
          </div>
          <div className="sidebar-item">
            <span>👥</span> Friends
          </div>
          <div className="sidebar-item">
            <span>📸</span> Photos
          </div>
          <div className="sidebar-item">
            <span>📺</span> Videos
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {/* Create Post Card */}
          <div className="create-post-card">
            <h3>Create Post</h3>
            <form onSubmit={createPost}>
              <input
                type="text"
                placeholder="Your Name"
                value={newPost.author}
                onChange={(e) => setNewPost({...newPost, author: e.target.value})}
                className="post-input"
              />
              <textarea
                placeholder="What's on your mind?"
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                className="post-textarea"
                rows="3"
              />
              <input
                type="text"
                placeholder="Image URL (optional)"
                value={newPost.imageUrl}
                onChange={(e) => setNewPost({...newPost, imageUrl: e.target.value})}
                className="post-input"
              />
              <button type="submit" disabled={loading} className="post-button">
                {loading ? 'Posting...' : 'Post'}
              </button>
            </form>
          </div>

          {/* Posts Feed */}
          <div className="posts-feed">
            <h3>News Feed</h3>
            {posts.length === 0 ? (
              <div className="no-posts">
                <p>No posts yet. Be the first to share something!</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="post-card">
                  <div className="post-header">
                    <div className="post-author">
                      <div className="avatar">{post.author.charAt(0)}</div>
                      <div>
                        <strong>{post.author}</strong>
                        <span className="post-time">
                          {new Date(post.createdDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => deletePost(post.id)}
                      className="delete-btn"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="post-content">
                    <p>{post.content}</p>
                  </div>
                  
                  {post.imageUrl && (
                    <div className="post-image">
                      <img src={post.imageUrl} alt="Post" />
                    </div>
                  )}
                  
                  <div className="post-actions">
                    <button>👍 Like</button>
                    <button>💬 Comment</button>
                    <button>🔄 Share</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="right-sidebar">
          <div className="sponsor-card">
            <h4>Sponsored</h4>
            <p>Your ad could be here!</p>
          </div>
          <div className="contacts-card">
            <h4>Contacts</h4>
            <div className="contact">
              <div className="avatar">J</div>
              <span>John Doe</span>
            </div>
            <div className="contact">
              <div className="avatar">S</div>
              <span>Sarah Smith</span>
            </div>
            <div className="contact">
              <div className="avatar">M</div>
              <span>Mike Johnson</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;