"use client";

import Auth from "@/components/Auth";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold">Welcome to BlitzChess</h1>
      <Auth />
    </div>
  );
}
