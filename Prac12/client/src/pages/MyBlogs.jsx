
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBlogs = useCallback(async () => {
    try {
      setError("");
      const { data } = await api.get("/blogs/mine");
      setBlogs(data.blogs);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load your blogs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  const deleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    try {
      await api.delete(`/blogs/${id}`);
      setBlogs((current) => current.filter((blog) => blog._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete blog");
    }
  };

  return (
    <main className="page-container">
      <div className="section-heading">
        <div>
          <h1>My Blogs</h1>
          <p className="muted">Manage your drafts and published posts.</p>
        </div>

        <Link to="/blogs/new" className="button">
          + Create Blog
        </Link>
      </div>

      {loading && <p className="center-message">Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && blogs.length === 0 && (
        <p className="empty-state">You haven't created any blogs yet.</p>
      )}

      <div className="management-list">
        {blogs.map((blog) => (
          <article className="management-item" key={blog._id}>
            <div>
              <span className={`status status-${blog.status}`}>
                {blog.status}
              </span>
              <h2>{blog.title}</h2>
              <p className="muted">
                Last updated: {new Date(blog.updatedAt).toLocaleDateString()}
              </p>
            </div>

            <div className="action-group">
              <Link
                className="button button-secondary"
                to={`/blogs/${blog._id}/edit`}
              >
                Edit
              </Link>
              <button
                className="button button-danger"
                onClick={() => deleteBlog(blog._id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
