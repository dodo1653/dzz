import React from "react";

export default function Layout({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden" style={{ zIndex: 1 }}>
      <div className="relative" style={{ zIndex: 1 }}>{children}</div>
    </div>
  );
}
