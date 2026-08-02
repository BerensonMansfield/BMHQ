"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setStatus("error");
      setError(error.message);
      return;
    }

    setStatus("sent");
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="text-sm uppercase tracking-wide text-accent font-medium">
          Internal systems
        </p>
        <h1 className="mt-3 font-display text-3xl">
          Berenson &amp; Mansfield HQ
        </h1>
        <p className="mt-2 text-muted">
          Enter your work email — we&apos;ll send you a link to sign in.
        </p>

        {status === "sent" ? (
          <div className="mt-8 rounded-xl border border-border bg-surface p-6">
            <p className="font-medium">Check your inbox</p>
            <p className="mt-1 text-sm text-muted">
              We sent a sign-in link to {email}. Open it on this device to
              continue.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@berensonmansfield.com"
              className="rounded-lg border border-border bg-surface px-4 py-2.5 outline-none focus:border-accent"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded-lg bg-accent px-4 py-2.5 font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Send magic link"}
            </button>
            {status === "error" && (
              <p className="text-sm text-bad">{error}</p>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
