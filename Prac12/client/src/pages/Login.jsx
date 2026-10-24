
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(form);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to log in");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="form-container">
      <h1>Welcome Back</h1>
      <p className="muted">Log in to manage your blogs.</p>

      <form onSubmit={handleSubmit} className="form">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          required
        />

        {error && <p className="error-message">{error}</p>}

        <button className="button" disabled={submitting}>
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="form-footer">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </section>
  );
}
