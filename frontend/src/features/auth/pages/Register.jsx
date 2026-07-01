import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../authStore";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { register, isLoading, error: apiError, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");
    setSuccessMsg("");
    clearError();

    if (!username || !email || !password || !confirmPassword) {
      setValidationError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters.");
      return;
    }

    const result = await register(username, email, password);
    if (result.success) {
      setSuccessMsg("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--bg-primary))] px-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-[hsla(263,70%,50%,0.08)] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-[hsla(191,91%,36%,0.05)] blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md glass-panel rounded-2xl p-8 shadow-2xl relative z-10 animate-slide-up">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-gradient mb-2">
            Create Account
          </h2>
          <p className="text-[hsl(var(--text-muted))] text-sm">
            Join RomoChat today
          </p>
        </div>

        {/* Error Banner */}
        {(validationError || apiError) && (
          <div className="mb-6 p-4 rounded-lg bg-[hsla(346,77%,49%,0.15)] border border-[hsla(346,77%,49%,0.3)] text-[hsl(var(--error))] text-sm animate-fade-in">
            {validationError || apiError}
          </div>
        )}

        {/* Success Banner */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-lg bg-[hsla(142,70%,45%,0.15)] border border-[hsla(142,70%,45%,0.3)] text-[hsl(var(--success))] text-sm animate-fade-in">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[hsl(var(--text-main))] mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg glass-input text-sm"
              placeholder="johndoe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[hsl(var(--text-main))] mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg glass-input text-sm"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[hsl(var(--text-main))] mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg glass-input text-sm"
              placeholder="•••••••• (min 6 chars)"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[hsl(var(--text-main))] mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg glass-input text-sm"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-lg bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-hover))] text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-[hsla(263,70%,50%,0.3)] disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-[1px] active:translate-y-0 cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating account...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-[hsl(var(--text-muted))]">
          Already have an account?{" "}
          <Link
            to="/login"
            onClick={clearError}
            className="text-[hsl(var(--accent))] hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
