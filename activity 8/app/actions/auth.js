"use server";

import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";

export async function signup(_prevState, formData) {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashedPassword,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return { error: "User already exists" };
    }

    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "Signup failed. Please try again." };
  }

  redirect("/login");
}

export async function login(_prevState, formData) {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return { error: "User not found" };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { error: "Invalid password" };
    }

    const cookieStore = await cookies();
    cookieStore.set("user", user.email, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "Login failed. Please try again." };
  }

  redirect("/dashboard");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("user");
  redirect("/login");
}
