'use server';

import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';
import dbConnect from '../../lib/db';
import User from '../../lib/models/User';

export async function signup(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  try {
    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: 'User already exists' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();

    return { success: true };
  } catch (error) {
    console.error('Signup error:', error);
    return { error: 'Something went wrong' };
  }
}