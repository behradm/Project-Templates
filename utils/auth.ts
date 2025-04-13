import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';

// Get the authenticated user from the request
export async function getAuthenticatedUser(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session?.user?.email) {
    return null;
  }
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  
  return user;
}

// Middleware to ensure the user is authenticated
export async function requireAuth(req: NextApiRequest, res: NextApiResponse, callback: Function) {
  const user = await getAuthenticatedUser(req, res);
  
  if (!user) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  
  return callback(user);
}

// Helper to create a "General" folder for new users
export async function createGeneralFolder(userId: string) {
  // Check if the user already has a General folder
  const existingFolder = await prisma.folder.findFirst({
    where: {
      userId,
      name: 'General',
    },
  });
  
  if (!existingFolder) {
    // Create the General folder
    return prisma.folder.create({
      data: {
        name: 'General',
        description: 'Default folder for your prompts',
        userId,
      },
    });
  }
  
  return existingFolder;
}
