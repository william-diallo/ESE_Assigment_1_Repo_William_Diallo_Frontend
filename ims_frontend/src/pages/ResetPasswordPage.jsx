import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { confirmPasswordReset } from "../services/api";

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  // Form state mirrors PasswordResetConfirmSerializer fields:
  // email, code, and new_password (plus confirmPassword for client-side matching)
  const [form, setForm] = useState({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Field-level errors from the backend PasswordResetConfirmSerializer validate() method
  // e.g. { email: "No account found...", code: "Invalid reset code...", new_password: [...] }
  const [fieldErrors, setFieldErrors] = useState({});
  // General error (network issues, etc.)
  const [generalError, setGeneralError] = useState("");
  // Loading state during the API request
  const [loading, setLoading] = useState(false);

  // Handle all text/password inputs — update form state and clear field error
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError("");

    // Client-side validation: confirm passwords match before hitting the network
    if (form.newPassword !== form.confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords do not match." });
      return;
    }

    setLoading(true);
    try {
      // Send email, code, new_password to PasswordResetConfirmSerializer.
      // Backend validates:
      //   1. User exists with this email
      //   2. Code exists, is not used, and is not expired
      //   3. new_password passes validate_password checks
      await confirmPasswordReset(form.email, form.code, form.newPassword);

      // Reset successful — redirect to login so user can sign in with new password
      navigate("/login", { replace: true });
    } catch (err) {
      // Django REST returns 400 with validation errors from PasswordResetConfirmSerializer.validate()
      // e.g. { email: [...], code: [...], new_password: [...] }
      if (err.response?.status === 400 && err.response.data) {
        const data = err.response.data;
        // Separate field errors from non_field_errors
        const { non_field_errors, ...fieldLevelErrors } = data;
        setFieldErrors(fieldLevelErrors);
        if (non_field_errors) {
          setGeneralError(non_field_errors.join(" "));
        }
      } else {
        setGeneralError("Password reset failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-shell page-shell--center">
      <div className="page-card page-card--compact">
        <p className="page-kicker">Password Recovery</p>
        <h1 className="page-title">Reset Password</h1>
        <p className="page-subtitle">
          Enter the reset code from your email and choose a new password.
        </p>

        {/* Top-level error (network, non_field_errors) */}
        {generalError && (
          <div className="status-message status-message--error">{generalError}</div>
        )}

        <form onSubmit={handleSubmit} className="app-form">
        {/* Email — required by PasswordResetConfirmSerializer */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={handleChange}
            required
          />
          {fieldErrors.email && (
            <p className="field-error">
              {Array.isArray(fieldErrors.email)
                ? fieldErrors.email.join(" ")
                : fieldErrors.email}
            </p>
          )}
        </div>

        {/* 6-digit reset code — from PasswordResetConfirmSerializer
            Backend checks: not used, not expired, exactly 6 characters */}
        <div className="form-group">
          <label htmlFor="code">Reset Code</label>
          <input
            id="code"
            name="code"
            type="text"
            placeholder="000000"
            maxLength="6"
            value={form.code}
            onChange={handleChange}
            required
          />
          {fieldErrors.code && (
            <p className="field-error">
              {Array.isArray(fieldErrors.code)
                ? fieldErrors.code.join(" ")
                : fieldErrors.code}
            </p>
          )}
        </div>

        {/* New password — validated server-side by django's validate_password */}
        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            placeholder="New Password"
            value={form.newPassword}
            onChange={handleChange}
            required
          />
          {fieldErrors.new_password && (
            <p className="field-error">
              {Array.isArray(fieldErrors.new_password)
                ? fieldErrors.new_password.join(" ")
                : fieldErrors.new_password}
            </p>
          )}
        </div>

        {/* Confirm new password — client-side only, not sent to backend */}
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

        <button type="submit" className="btn btn--block" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
        </form>

        {/* Navigation back to login */}
        <div className="text-actions">
          <p>
            Remember your password?{" "}
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
