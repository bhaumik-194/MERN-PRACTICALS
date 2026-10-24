
import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminDashboard() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/blogs/admin/all")
      .then(({ data }) => setBlogs(data.blogs))
      .catch((err) =>
        setError(err.response?.data?.message || "Unable to load blogs")
      )
      .finally(() => setLoading(false));
  }, []);

  const deleteBlog = async (id) => {
    if (!window.confirm("Delete this blog permanently?")) return;

    try {
      await api.delete(`/blogs/${id}`);
      setBlogs((current) => current.filter((blog) => blog._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete blog");
    }
  };

  return (
    <main className="page-container">
      <h1>Admin Dashboard</h1>
      <p className="muted">Manage all users' blog posts.</p>

      {loading && <p className="center-message">Loading blogs...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && blogs.length === 0 && (
        <p className="empty-state">No blogs found.</p>
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
                Author: {blog.author?.name || "Unknown"} ·{" "}
                {blog.author?.email || ""}
              </p>
            </div>

            <button
              className="button button-danger"
              onClick={() => deleteBlog(blog._id)}
            >
              Delete
            </button>
          </article>
        ))}
      </div>
    </main>
  );
}
