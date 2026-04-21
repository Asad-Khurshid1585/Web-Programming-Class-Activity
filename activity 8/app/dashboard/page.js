import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";

export default async function DashboardPage() {
  const user = (await cookies()).get("user")?.value;

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="auth-page">
      <section className="simple-card">
        <h1>Dashboard</h1>
        <p>Welcome, {user}</p>
        <form action={logout}>
          <button type="submit">Logout</button>
        </form>
      </section>
    </main>
  );
}
