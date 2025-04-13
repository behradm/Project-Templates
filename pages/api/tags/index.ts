import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<any>>
) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session?.user?.id) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  
  const userId = session.user.id;
  
  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      return getTags(req, res, userId);
    case 'POST':
      return createTag(req, res, userId);
    default:
      return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}

// GET: List all tags for the authenticated user
async function getTags(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const tags = await prisma.tag.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
    
    return res.status(200).json({ success: true, data: tags });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch tags' });
  }
}

// POST: Create a new tag
async function createTag(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { name, color } = req.body;
    
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Tag name is required' });
    }
    
    // Check if a tag with this name already exists for this user
    const existingTag = await prisma.tag.findFirst({
      where: {
        userId,
        name: {
          equals: name.trim(),
          mode: 'insensitive', // Case-insensitive comparison
        },
      },
    });
    
    if (existingTag) {
      return res.status(200).json({ success: true, data: existingTag });
    }
    
    // Create the new tag with color
    const tag = await prisma.tag.create({
      data: {
        name: name.trim(),
        color: typeof color === 'number' ? color : 0,
        userId,
      },
    });
    
    return res.status(201).json({ success: true, data: tag });
  } catch (error) {
    console.error('Error creating tag:', error);
    return res.status(500).json({ success: false, error: 'Failed to create tag' });
  }
}
