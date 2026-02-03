"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Split email to create a temporary name if user didn't provide one
    const tempName = email.split("@")[0];

    await authClient.signUp.email(
      {
        email,
        password,
        name: tempName, // Do not leave this empty
      },
      {
        onSuccess: (ctx) => {
          // This runs ONLY after the user is created in Convex
          window.location.href = "/account";
        },
        onError: (ctx) => {
          setError(ctx.error.message);
          setLoading(false);
        },
      },
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="space-y-4 w-80">
        <h1 className="text-2xl font-semibold"> Create account</h1>

        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Creating..." : "Sign up"}
        </button>
      </form>
    </div>
  );
}
