import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestPasswordReset } from "../services/api";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  // Single field: email address to send reset code to
  const [email, setEmail] = useState("");
  // Error message from server validation or network issues
  const [error, setError] = useState("");
  // Success flag — show after reset code is sent
  const [resetCodeSent, setResetCodeSent] = useState(false);
  // Loading state during the request
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    setLoading(true);
    try {
      // Send email to the PasswordResetRequestSerializer endpoint.
      // Backend validates it exists and sends a 6-digit code to that email.
      await requestPasswordReset(email);

      // If successful, show confirmation and prompt user to go to reset page
      setResetCodeSent(true);
    } catch (err) {
      // Handle validation errors from Django —
      // e.g. { email: ["No account found with this email."] }
      if (err.response?.status === 400 && err.response.data?.email) {
        setError(err.response.data.email.join(" "));
      } else {
        setError("Failed to send reset code. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  // If reset code was sent successfully, show success message
  if (resetCodeSent) {
    return (
      <div>
        <h1>Check Your Email</h1>
        <p>
          We've sent a reset code to <strong>{email}</strong>. Check your
          email and follow the instructions to reset your password.
        </p>
        <button type="button" onClick={() => navigate("/reset-password")}>
          Enter Reset Code
        </button>
        <p>
          Remember your password?{" "}
          <button type="button" onClick={() => navigate("/login")}>
            Back to Login
          </button>
        </p>
      </div>
    );
  }

  // Request form — collect email and send it to the backend
  return (
    <div>
      <h1>Forgot Password?</h1>
      <p>Enter your email address and we'll send you a reset code.</p>

      {/* Display any validation or network errors */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Email input — matches PasswordResetRequestSerializer.email field */}
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Code"}
        </button>
      </form>

      {/* Navigation back to login */}
      <p>
        Remember your password?{" "}
        <button type="button" onClick={() => navigate("/login")}>
          Back to Login
        </button>
      </p>
    </div>
  );
}
