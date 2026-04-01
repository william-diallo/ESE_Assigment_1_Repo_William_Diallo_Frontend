import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../features/auth";
import { ROUTES } from "../constants/routes";
import { hasUnsafeInput, isValidEmail } from "../utils/inputValidation";

// Role options that the backend supports via the User model.
// "STAFF" is the default set by RegisterSerializer when no role is provided.
const ROLE_OPTIONS = [
  { value: "STAFF", label: "Staff" },
  { value: "ADMIN", label: "Admin" },
];

export default function RegisterPage() {
  const navigate = useNavigate();

  // Form state mirrors the three fields in RegisterSerializer:
  // email, password, and role (optional — backend defaults to STAFF)
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "STAFF",
  });

  // fieldErrors maps individual field names to server-side validation messages
  const [fieldErrors, setFieldErrors] = useState({});
  // generalError holds any non-field error (e.g. network failure)
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  // Single handler for all text/select inputs — updates the matching key in form state
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear the field error for this input as the user corrects it
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError("");

    const clientErrors = {};

    if (!isValidEmail(form.email)) {
      clientErrors.email = "Enter a valid email address.";
    } else if (hasUnsafeInput(form.email)) {
      clientErrors.email = "Email contains disallowed characters or patterns.";
    }

    if (hasUnsafeInput(form.password)) {
      clientErrors.password = "Password contains disallowed characters or patterns.";
    }

    if (hasUnsafeInput(form.confirmPassword)) {
      clientErrors.confirmPassword =
        "Confirm password contains disallowed characters or patterns.";
    }

    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      return;
    }

    // Client-side password confirmation check before hitting the network
    if (form.password !== form.confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords do not match." });
      return;
    }

    setLoading(true);
    try {
      // Send only the fields the serializer expects — omit confirmPassword
      await registerUser({
        email: form.email,
        password: form.password,
        role: form.role,
      });

      // Registration succeeded — redirect to login so the user can sign in
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (err) {
      // Django REST Framework returns 400 with a detail object on validation failure.
      // e.g. { email: ["user with this email already exists."], password: ["..."] }
      if (err.response?.status === 400 && err.response.data) {
        const data = err.response.data;
        // Separate known field errors from any top-level non_field_errors
        const { non_field_errors, ...fieldLevelErrors } = data;
        setFieldErrors(fieldLevelErrors);
        if (non_field_errors) {
          setGeneralError(non_field_errors.join(" "));
        }
      } else {
        setGeneralError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-shell page-shell--center">
      <div className="page-card page-card--compact">
        <p className="page-kicker">Inventory Management</p>
        <h1 className="page-title">Create Account</h1>
        <p className="page-subtitle">
          Register a new account with the access level required for your team.
        </p>

        {/* Top-level error (network issues or non_field_errors from the serializer) */}
        {generalError && (
          <div className="status-message status-message--error">{generalError}</div>
        )}

        <form onSubmit={handleSubmit} className="app-form">
        {/* Email — required by RegisterSerializer */}
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
          {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
        </div>

        {/* Password — validated server-side by django's validate_password */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {fieldErrors.password && (
            <p className="field-error">{fieldErrors.password}</p>
          )}
        </div>

        {/* Confirm Password — client-side only, not sent to the backend */}
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          {fieldErrors.confirmPassword && (
            <p className="field-error">{fieldErrors.confirmPassword}</p>
          )}
        </div>

        {/* Role — corresponds to the role field in RegisterSerializer.
            Defaults to STAFF, matching the serializer's create() default. */}
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {fieldErrors.role && <p className="field-error">{fieldErrors.role}</p>}
        </div>

        <button type="submit" className="btn btn--block" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        </form>

        {/* Link back to login for users who already have an account */}
        <div className="text-actions">
          <p>
            Already have an account?{" "}
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => navigate(ROUTES.LOGIN)}
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
