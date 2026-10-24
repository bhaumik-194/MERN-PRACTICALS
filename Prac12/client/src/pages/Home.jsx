
import { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import api from "../services/api";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/blogs")
      .then(({ data }) => setBlogs(data.blogs))
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to load blogs")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="page-container">
      <section className="hero">
        <p className="eyebrow">IDEAS. STORIES. KNOWLEDGE.</p>
        <h1>Stories worth reading.</h1>
        <p>Discover articles and ideas shared by our community.</p>
      </section>

      <div className="section-heading">
        <h2>Latest Blogs</h2>
      </div>

      {loading && <p className="center-message">Loading blogs...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && blogs.length === 0 && (
        <p className="empty-state">No published blogs yet.</p>
      )}

      <div className="blog-grid">
        {blogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    </main>
  );
}
