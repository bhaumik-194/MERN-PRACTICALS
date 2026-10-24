
import { Link } from "react-router-dom";

export default function BlogCard({ blog }) {
  return (
    <article className="blog-card">
      <span className={`status status-${blog.status}`}>
        {blog.status}
      </span>

      <h2>{blog.title}</h2>
      <p className="muted">
        By {blog.author?.name || "Unknown author"}
      </p>

      <p className="blog-preview">
        {blog.content.length > 180
          ? `${blog.content.slice(0, 180)}...`
          : blog.content}
      </p>

      {blog.status === "published" && (
        <Link className="text-link" to={`/blogs/${blog._id}`}>
          Read blog →
        </Link>
      )}
    </article>
  );
}
