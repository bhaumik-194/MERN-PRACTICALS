
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

export default function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    api
      .get(`/blogs/${id}`)
      .then(({ data }) => {
        if (active) setBlog(data.blog);
      })
      .catch((err) => {
        if (active) {
          setError(err.response?.data?.message || "Unable to load blog");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) return <p className="center-message">Loading blog...</p>;

  if (error || !blog) {
    return (
      <main className="page-container">
        <p className="error-message">{error || "Blog not found"}</p>
        <Link to="/" className="text-link">Return home</Link>
      </main>
    );
  }

  return (
    <article className="article-container">
      <Link to="/" className="text-link">← All Blogs</Link>
      <h1>{blog.title}</h1>
      <p className="muted">
        By {blog.author?.name || "Unknown author"} ·{" "}
        {new Date(blog.createdAt).toLocaleDateString()}
      </p>
      <div className="article-content">{blog.content}</div>
    </article>
  );
}
