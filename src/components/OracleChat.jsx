import React, { useState, useRef, useEffect } from "react";

const OracleChat = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'You have summoned The Oracle. Ask about pump.fun, Solana, or risk in the shadows...' }]);
  return (
    <>
      <button onClick={() => setOpen(!open)} style={{ position: 'fixed', bottom: 30, right: 32, width: 60, height: 60, borderRadius: '50%', background: '#7b5cf6', color: 'white', border: 'none', cursor: 'pointer', fontSize: 24 }}>☉</button>
      {open && (
        <div style={{ position: 'fixed', bottom: 100, right: 32, width: 350, background: '#0a0a14', borderRadius: 24, padding: 20, border: '1px solid #7b5cf6' }}>
          <div style={{ color: 'white' }}>Oracle Stream Active...</div>
        </div>
      )}
    </>
  );
};

export default OracleChat;
