import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed', success: false });
  }

  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required', success: false });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters', success: false });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use', success: false });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        name: name || null,
        email,
        password: hashedPassword,
      },
    });

    // Return success without exposing sensitive info
    return res.status(201).json({ 
      success: true, 
      message: 'User created successfully',
      userId: user.id
    });
    
  } catch (error: any) {
    console.error('Signup error:', error);
    return res.status(500).json({ 
      error: error.message || 'Something went wrong', 
      success: false
    });
  }
}
