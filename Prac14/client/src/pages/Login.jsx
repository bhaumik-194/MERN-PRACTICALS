
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setSubmitting(true);
      await login({
        email: form.email.trim(),
        password: form.password,
      });

      const destination = location.state?.from?.pathname || "/dashboard";
      navigate(destination, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to sign in. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-heading">
        <span className="auth-mobile-brand">DMS Workspace</span>
        <h2>Welcome back</h2>
        <p>Sign in to access your documents.</p>
      </div>

      {error && (
        <div className="form-alert" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <label htmlFor="email">Email address</label>
        <div className="input-with-icon">
          <Mail size={18} aria-hidden="true" />
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            maxLength={254}
            required
          />
        </div>

        <label htmlFor="password">Password</label>
        <div className="input-with-icon">
          <LockKeyhole size={18} aria-hidden="true" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          className="auth-submit"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="auth-footer">
        Don't have an account? <Link to="/register">Create one</Link>
      </p>
    </div>
  );
}
