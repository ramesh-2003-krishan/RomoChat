import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[hsl(var(--bg-primary))] px-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-[hsla(263,70%,50%,0.08)] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-[hsla(191,91%,36%,0.05)] blur-[120px] pointer-events-none" />

      <div className="text-center z-10 glass-panel max-w-md w-full rounded-2xl p-8 shadow-2xl animate-slide-up">
        <h1 className="text-8xl font-black text-gradient mb-4">
          404
        </h1>
        <h2 className="text-2xl font-bold text-[hsl(var(--text-main))] mb-4">
          Page Not Found
        </h2>
        <p className="text-[hsl(var(--text-muted))] mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 rounded-lg bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-hover))] text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-[hsla(263,70%,50%,0.3)] hover:-translate-y-[1px] active:translate-y-0 cursor-pointer"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
