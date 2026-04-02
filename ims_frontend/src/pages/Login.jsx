import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../features/auth";
import { AuthContext } from "../context/AuthContext";
import { hasUnsafeInput, isValidEmail } from "../utils/inputValidation";
import { ROUTES } from "../constants/routes";

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

    // Validate user identifier input; password complexity belongs to backend policy.
    if (hasUnsafeInput(form.email)) {
      setError("Input contains disallowed characters or patterns.");
      return;
    }

    try {
      const res = await loginUser(form);
      const token =
        res.data?.access ||
        res.data?.token ||
        res.data?.access_token ||
        res.data?.jwt;
      const user = res.data?.user || null;

      if (!token) {
        throw new Error("Login response missing token");
      }

      console.log("LOGIN SUCCESS, redirecting...", res.data);

      await login(token, user); // store token + user (AuthProvider will resolve auth state)
      console.log("NAVIGATE FIRING"); //debugging
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      // Differentiate bad credentials from network/CORS/backend failures.
      if (err.response) {
        const serverMessage =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          (err.response?.status === 401
            ? "Invalid email or password"
            : "Login failed. Please try again.");
        setError(serverMessage);
      } else if (err.request) {
        setError(
          "Cannot reach the server. Check API base URL, CORS settings, and HTTPS configuration."
        );
      } else {
        setError(err.message || "Login failed. Please try again.");
      }

      console.error("LOGIN ERROR", {
        message: err.message,
        code: err.code,
        baseURL: err.config?.baseURL,
        requestURL: err.config?.url,
        status: err.response?.status,
        data: err.response?.data,
      });
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
              onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
            >
              Forgot Password?
            </button>
          </p>
          <p>
            Don't have an account?{" "}
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => navigate(ROUTES.REGISTER)}
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
