
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);

  const [form, setForm] = useState({
    title: "",
    content: "",
    status: "draft",
  });
  const [loading, setLoading] = useState(editing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editing) return;

    let active = true;

    api
      .get("/blogs/mine")
      .then(({ data }) => {
        const blog = data.blogs.find((item) => item._id === id);

        if (!blog) {
          throw new Error("Blog not found in your posts");
        }

        if (active) {
          setForm({
            title: blog.title,
            content: blog.content,
            status: blog.status,
          });
        }
      })
      .catch((err) => {
        if (active) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Unable to load blog"
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [editing, id]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (editing) {
        await api.put(`/blogs/${id}`, form);
      } else {
        await api.post("/blogs", form);
      }

      navigate("/my-blogs", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save blog");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="center-message">Loading blog...</p>;
  }

  return (
    <section className="editor-container">
      <Link to="/my-blogs" className="text-link">← Back to My Blogs</Link>
      <h1>{editing ? "Edit Blog" : "Create a Blog"}</h1>

      <form onSubmit={handleSubmit} className="form">
        <label htmlFor="title">Blog Title</label>
        <input
          id="title"
          name="title"
          minLength={3}
          maxLength={160}
          value={form.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          minLength={10}
          maxLength={50000}
          rows={12}
          value={form.content}
          onChange={handleChange}
          required
        />

        <label htmlFor="status">Publication Status</label>
        <select
          id="status"
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="draft">Save as Draft</option>
          <option value="published">Publish</option>
        </select>

        {error && <p className="error-message">{error}</p>}

        <button className="button" disabled={submitting}>
          {submitting ? "Saving..." : editing ? "Update Blog" : "Create Blog"}
        </button>
      </form>
    </section>
  );
}
