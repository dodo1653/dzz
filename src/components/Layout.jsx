import React from "react";

export default function Layout({ children }) {
  return (
    <div className="relative z-10 min-h-screen overflow-hidden">
      <div className="relative z-1">{children}</div>
    </div>
  );
}
