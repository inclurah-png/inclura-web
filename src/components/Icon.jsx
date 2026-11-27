import React from "react";

const PATHS = {
  home: "M3 10.5 12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-5v-6h-5v6h-5A1.5 1.5 0 0 1 3 19.5v-9Z",
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4",
  message: "M20 11.5a8 8 0 0 1-8 8 8.8 8.8 0 0 1-3.2-.6L4 20l1.1-4.2A8 8 0 1 1 20 11.5Z",
  link: "M10.6 13.4 13.4 10.6M8.2 16.8l-1.4 1.4a3.4 3.4 0 1 1-4.8-4.8l4-4a3.4 3.4 0 0 1 4.8 0M15.8 7.2l1.4-1.4a3.4 3.4 0 1 1 4.8 4.8l-4 4a3.4 3.4 0 0 1-4.8 0",
  phone: "M6.6 3.5 9 3l1.7 4-2.1 1.7a15 15 0 0 0 6.7 6.7l1.7-2.1 4 1.7-.5 2.4a2 2 0 0 1-2.2 1.6A16.8 16.8 0 0 1 4.9 5.7 2 2 0 0 1 6.6 3.5Z",
  bookmark: "M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-3.5L6 21V4.5Z",
  search: "m21 21-4.3-4.3M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z",
  settings: "M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm7.2 3.5a7.7 7.7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a7.7 7.7 0 0 0-1.7-1L14.7 3h-4l-.3 3.1a7.7 7.7 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.5a7.7 7.7 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a7.7 7.7 0 0 0 1.7 1l.3 3.1h4l.3-3.1a7.7 7.7 0 0 0 1.7-1l2.4 1 2-3.4-2-1.5a7.7 7.7 0 0 0 .1-1Z",
  lock: "M7 10V7a5 5 0 0 1 10 0v3M6 10h12v10H6V10Z",
  accessibility: "M12 5.5a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6ZM5 7h14M12 7v13M8 20l4-7 4 7",
  briefcase: "M4 7.5h16A2 2 0 0 1 22 9.5v9A2 2 0 0 1 20 20.5H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2ZM8 7.5V5.8A1.8 1.8 0 0 1 9.8 4h4.4A1.8 1.8 0 0 1 16 5.8v1.7",
  handshake: "M4 12h3l2-2 3 2 3-2 2 2h3M7 12l-3 3 3 3 3-3M17 12l3 3-3 3-3-3M9 10l3-3 3 3",
  graduation: "m3 9 9-5 9 5-9 5-9-5Zm4 3v5c3 2 8 2 10 0v-5M21 10v5",
  cart: "M3 4h2l2.4 11.2A2 2 0 0 0 9.4 17H18a2 2 0 0 0 2-1.5L21.5 8H6M10 21a1 1 0 1 0 0-.01M18 21a1 1 0 1 0 0-.01",
  video: "M4 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm12 4 6-3v10l-6-3",
  sparkle: "m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2ZM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z",
  megaphone: "M4 10v4h3l8 4V6l-8 4H4Zm11-4 4-2v12l-4-2M7 14l1 5h3l-1-5",
  building: "M4 21V4h10v17M14 9h6v12M8 7h2M8 11h2M8 15h2M17 12h1M17 16h1",
  chart: "M4 19V9M10 19V5M16 19v-8M22 19V3",
  dollar: "M12 2v20M16 6.5c-.8-1-2.1-1.5-4-1.5-2.4 0-4 1.2-4 3s1.6 3 4 3 4 1.2 4 3-1.6 3-4 3c-1.9 0-3.2-.5-4-1.5",
  users: "M16 20v-1.5a4.5 4.5 0 0 0-4.5-4.5h-3A4.5 4.5 0 0 0 4 18.5V20M10 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM17 12a3 3 0 1 0 0-6M17 15h1a4 4 0 0 1 4 4v1",
  alert: "M12 3 2.5 20h19L12 3ZM12 9v5M12 18v.1",
  clipboard: "M9 4h6l1 2h3v15H5V6h3l1-2Zm0 0v2h6V4M8 11h8M8 15h6",
  check: "M5 12.5 9.5 17 19 7",
  admin: "M9 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 21v-2a6 6 0 0 1 12 0v2M16 11h5M18.5 8.5v5",
  logout: "M10 5H5v14h5M14 8l4 4-4 4M18 12H9",
  sos: "M12 3 2.5 20h19L12 3ZM12 9v4M12 17v.1"
};

export default function Icon({ name, size = 18, label }) {
  const d = PATHS[name] || PATHS.alert;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      focusable="false"
      style={{ flex: "0 0 auto", verticalAlign: "middle" }}
    >
      <path d={d} />
    </svg>
  );
}
