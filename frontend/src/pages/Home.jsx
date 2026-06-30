import React from "react";
import { useAuthStore } from "../features/auth/authStore";

const Home = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-[hsl(var(--bg-primary))] flex flex-col relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-[hsla(263,70%,50%,0.08)] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-[hsla(191,91%,36%,0.05)] blur-[120px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="glass-panel sticky top-0 z-50 border-x-0 border-t-0 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[hsl(var(--primary))] to-[hsl(var(--accent))] flex items-center justify-center font-bold text-white shadow-md">
            R
          </div>
          <span className="text-xl font-bold tracking-tight text-gradient">
            RomoChat
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-[hsl(var(--text-main))]">
              {user?.username || "Guest"}
            </p>
            <p className="text-xs text-[hsl(var(--text-muted))]">
              {user?.email || ""}
            </p>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg bg-[hsla(346,77%,49%,0.1)] border border-[hsla(346,77%,49%,0.2)] text-[hsl(var(--error))] text-sm font-medium hover:bg-[hsla(346,77%,49%,0.18)] transition-all duration-200 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Dashboard Body */}
      <main className="flex-1 flex items-center justify-center p-6 z-10">
        <div className="max-w-2xl w-full glass-panel rounded-2xl p-10 text-center animate-slide-up shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-[hsla(263,70%,50%,0.1)] border border-[hsla(263,70%,50%,0.2)] flex items-center justify-center text-3xl mx-auto mb-6">
            🎉
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gradient mb-4">
            Hello, {user?.username || "Friend"}!
          </h1>
          <p className="text-[hsl(var(--text-muted))] mb-8 max-w-md mx-auto text-base">
            You've successfully authenticated and accessed the protected RomoChat area. Realtime features and room lobbies are now available to integrate!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
            <div className="p-5 rounded-xl border border-[hsl(var(--card-border))] bg-[hsla(240,10%,7%,0.4)] text-left">
              <h3 className="text-sm font-bold text-gradient mb-1">
                Realtime Gateway
              </h3>
              <p className="text-xs text-[hsl(var(--text-muted))]">
                WS connection: <code className="text-[hsl(var(--accent))]">http://localhost:5004</code>
              </p>
            </div>
            <div className="p-5 rounded-xl border border-[hsl(var(--card-border))] bg-[hsla(240,10%,7%,0.4)] text-left">
              <h3 className="text-sm font-bold text-gradient mb-1">
                Auth Status
              </h3>
              <p className="text-xs text-[hsl(var(--text-muted))]">
                Logged in as <code className="text-[hsl(var(--accent))]">{user?.email}</code>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
