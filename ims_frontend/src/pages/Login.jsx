import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { hasUnsafeInput, isValidEmail } from "../utils/inputValidation";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!isValidEmail(form.email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (hasUnsafeInput(form.email) || hasUnsafeInput(form.password)) {
      setError("Input contains disallowed characters or patterns.");
      return;
    }

    try {
      const res = await loginUser(form);
      const { access, user } = res.data;

      console.log("LOGIN SUCCESS, redirecting...", res.data);

      await login(access, user); // store token + user (AuthProvider will resolve auth state)
      console.log("NAVIGATE FIRING"); //debugging
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError("Invalid email or password");
    }
  }

  return (
    <div className="page-shell page-shell--center">
      <div className="page-card page-card--compact">
        <p className="page-kicker">Inventory Management</p>
        <h1 className="page-title">Login</h1>
        <p className="page-subtitle">
          Sign in to access inventory records, item search, and management
          actions.
        </p>

        {error && <div className="status-message status-message--error">{error}</div>}

        <form onSubmit={handleSubmit} className="app-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn--block">
            Login
          </button>
        </form>

        <div className="text-actions">
          <p>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </button>
          </p>
          <p>
            Don't have an account?{" "}
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
