import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfileAPI, updateProfileAPI } from "../services/userService";
import { useAuthStore } from "../features/auth/authStore";
import Avatar from "../components/common/Avatar";

const Settings = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.user);

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch user profile from API
  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfileAPI,
  });

  // Populate state on load
  useEffect(() => {
    if (data?.profile) {
      setDisplayName(data.profile.displayName || "");
      setUsername(data.profile.username || "");
      setEmail(data.profile.email || "");
      setBio(data.profile.bio || "");
      setAvatar(data.profile.avatar || "");
    }
  }, [data]);

  // Profile update mutation
  const mutation = useMutation({
    mutationFn: updateProfileAPI,
    onSuccess: (res) => {
      setSuccessMsg("Profile updated successfully!");
      setErrorMsg("");

      // Update React Query Cache
      queryClient.setQueryData(["profile"], res);

      // Sync with Zustand auth state & localStorage
      const updatedUser = {
        ...authUser,
        username: res.profile.username,
        email: res.profile.email,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      useAuthStore.setState({ user: updatedUser });

      setTimeout(() => setSuccessMsg(""), 3000);
    },
    onError: (err) => {
      const errMsg = err.response?.data?.message || err.message || "Failed to update profile";
      setErrorMsg(errMsg);
      setSuccessMsg("");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!username || !email) {
      setErrorMsg("Username and Email are required.");
      return;
    }

    mutation.mutate({
      displayName,
      username,
      email,
      bio,
      avatar,
    });
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--bg-primary))] flex flex-col relative overflow-hidden px-4 py-8">
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-[hsla(263,70%,50%,0.08)] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-[hsla(191,91%,36%,0.05)] blur-[120px] pointer-events-none" />

      <div className="max-w-2xl w-full mx-auto glass-panel rounded-2xl p-8 shadow-2xl relative z-10 animate-slide-up">
        {/* Header navigation bar */}
        <div className="flex items-center justify-between mb-8 border-b border-[hsl(var(--card-border))] pb-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-2 rounded-lg hover:bg-[hsl(var(--bg-tertiary))] text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-main))] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h2 className="text-2xl font-bold text-gradient">Profile Settings</h2>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <svg className="animate-spin h-8 w-8 text-[hsl(var(--primary))]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-sm text-[hsl(var(--text-muted))]">Loading profile details...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-16 space-y-4">
            <div className="text-red-500 text-sm">Failed to load profile. Please try again.</div>
            <Link to="/" className="inline-block text-xs font-bold text-[hsl(var(--accent))] hover:underline">
              Return Home
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Messages feedback banners */}
            {errorMsg && (
              <div className="p-4 rounded-lg bg-[hsla(346,77%,49%,0.15)] border border-[hsla(346,77%,49%,0.3)] text-[hsl(var(--error))] text-sm">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="p-4 rounded-lg bg-[hsla(142,70%,45%,0.15)] border border-[hsla(142,70%,45%,0.3)] text-[hsl(var(--success))] text-sm">
                {successMsg}
              </div>
            )}

            {/* Profile Avatar Card Preview */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border border-[hsl(var(--card-border))] bg-[hsla(240,10%,7%,0.4)] mb-6">
              <Avatar name={displayName || username || "Me"} size="w-16 h-16" />
              <div className="text-center sm:text-left">
                <h3 className="text-md font-bold text-[hsl(var(--text-main))]">{displayName || username}</h3>
                <p className="text-xs text-[hsl(var(--text-muted))] mt-1">Avatar auto-computes dynamic gradients based on initials</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[hsl(var(--text-main))] mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg glass-input text-sm"
                  placeholder="e.g. Subham Rana"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[hsl(var(--text-main))] mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg glass-input text-sm"
                  placeholder="johndoe"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[hsl(var(--text-main))] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg glass-input text-sm"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[hsl(var(--text-main))] mb-2">
                  Bio / Status Message
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2.5 rounded-lg glass-input text-sm resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[hsl(var(--card-border))]">
              <button
                type="submit"
                disabled={mutation.isPending}
                className="px-6 py-2.5 rounded-lg bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-hover))] text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-[hsla(263,70%,50%,0.3)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {mutation.isPending ? "Saving changes..." : "Save Profile"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Settings;
