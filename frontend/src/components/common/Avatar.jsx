import React from "react";

const getInitials = (name = "") => {
  const parts = name.trim().split(" ");
  if (parts.length === 0 || !parts[0]) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const Avatar = ({ name = "", size = "w-10 h-10", isOnline = false, className = "" }) => {
  // Hash name to get a consistent gradient color
  const colors = [
    "from-purple-500 to-indigo-500",
    "from-pink-500 to-rose-500",
    "from-cyan-500 to-blue-500",
    "from-emerald-500 to-teal-500",
    "from-amber-500 to-orange-500",
  ];
  
  const charCodeSum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorGradient = colors[charCodeSum % colors.length];

  return (
    <div className={`relative flex-shrink-0 ${size} ${className}`}>
      <div className={`w-full h-full rounded-xl bg-gradient-to-tr ${colorGradient} flex items-center justify-center font-bold text-white shadow-md text-sm tracking-wide`}>
        {getInitials(name)}
      </div>
      
      {isOnline && (
        <span className="absolute bottom-[-2px] right-[-2px] block h-3 w-3 rounded-full bg-[hsl(var(--success))] ring-2 ring-[hsl(var(--bg-primary))]" />
      )}
    </div>
  );
};

export default Avatar;
