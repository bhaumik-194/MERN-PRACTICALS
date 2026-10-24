
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (form.name.trim().length < 2 || form.name.trim().length > 60) {
      setError("Name must be between 2 and 60 characters.");
      return;
    }

    if (form.password.length < 8 || form.password.length > 72) {
      setError("Password must be between 8 and 72 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);

      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to create your account."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-heading">
        <span className="auth-mobile-brand">DMS Workspace</span>
        <h2>Create your account</h2>
        <p>Set up your workspace to manage documents securely.</p>
      </div>

      {error && (
        <div className="form-alert" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <label htmlFor="name">Full name</label>
        <div className="input-with-icon">
          <UserRound size={18} aria-hidden="true" />
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Your full name"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
            minLength={2}
            maxLength={60}
            required
          />
        </div>

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
            placeholder="At least 8 characters"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            minLength={8}
            maxLength={72}
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

        <label htmlFor="confirmPassword">Confirm password</label>
        <div className="input-with-icon">
          <LockKeyhole size={18} aria-hidden="true" />
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Re-enter your password"
            value={form.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />
        </div>

        <button
          type="submit"
          className="auth-submit"
          disabled={submitting}
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="auth-footer">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}
