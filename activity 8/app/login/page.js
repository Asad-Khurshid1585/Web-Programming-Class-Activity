"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, { error: "" });

  return (
    <main className="auth-page">
      <form className="simple-form" action={formAction}>
        <h1>Login</h1>
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        {state?.error ? <p className="error-text">{state.error}</p> : null}
        <button type="submit" disabled={isPending}>
          {isPending ? "Please wait..." : "Login"}
        </button>
        <p>
          No account? <Link href="/signup">Signup</Link>
        </p>
      </form>
    </main>
  );
}
