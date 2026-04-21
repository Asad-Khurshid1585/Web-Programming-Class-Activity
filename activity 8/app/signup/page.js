"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signup } from "@/app/actions/auth";

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signup, { error: "" });

  return (
    <main className="auth-page">
      <form className="simple-form" action={formAction}>
        <h1>Signup</h1>
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        {state?.error ? <p className="error-text">{state.error}</p> : null}
        <button type="submit" disabled={isPending}>
          {isPending ? "Please wait..." : "Signup"}
        </button>
        <p>
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}
