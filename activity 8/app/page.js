import Link from "next/link";

export default function Home() {
  return (
    <main className="auth-page">
      <section className="simple-card">
        <h1>Simple Auth App</h1>
        <p>Please login or create an account.</p>
        <div className="button-row">
          <Link href="/login" className="simple-btn-link">
            Login
          </Link>
          <Link href="/signup" className="simple-btn-link">
            Signup
          </Link>
        </div>
      </section>
    </main>
  );
}
