"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";

export default function Sidebar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data.user) {
        setUser(data.user);
      }
    };

    fetchSession();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h1 className="text-xl font-bold mb-6">Prediction League</h1>
      <nav className="space-y-4">
        <Link href="/fixtures2" className="block hover:text-gray-300">Fixtures</Link>
        <Link href="/leaderboard" className="block hover:text-gray-300">Leaderboard</Link>
        {user && user.email === "admin@example.com" && (
          <Link href="/admin/results" className="block hover:text-gray-300">Admin: Results</Link>
        )}
      </nav>
      <div className="mt-8 border-t border-gray-700 pt-4">
        {user ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-400">Logged in as:</p>
            <p className="text-sm">{user.email}</p>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1 rounded text-white hover:bg-red-700 text-sm"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link href="/auth" className="bg-green-600 px-3 py-1 rounded text-white hover:bg-green-700 text-sm inline-block">
            Login
          </Link>
        )}
      </div>
    </aside>
  );
}
