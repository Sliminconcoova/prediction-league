"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else router.push("/fixtures2"); // redirect on success
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else router.push("/fixtures2");
  };

  return (
    <div className="max-w-sm mx-auto p-4">
      <h1 className="text-2xl mb-4">Login or Sign Up</h1>
      {error && <p className="text-red-600">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border px-2 py-1 rounded w-full mb-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border px-2 py-1 rounded w-full mb-4"
      />
      <div className="flex space-x-2">
        <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded">
          Login
        </button>
        <button onClick={handleSignUp} className="bg-green-600 text-white px-4 py-2 rounded">
          Sign Up
        </button>
      </div>
    </div>
  );
}
