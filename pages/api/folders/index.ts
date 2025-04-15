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
      return getFolders(req, res, userId);
    case 'POST':
      return createFolder(req, res, userId);
    default:
      return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}

// GET: List all folders for the authenticated user
async function getFolders(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const folders = await prisma.folder.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
    
    return res.status(200).json({ success: true, data: folders });
  } catch (error) {
    console.error('Error fetching folders:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch folders' });
  }
}

// POST: Create a new folder
async function createFolder(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { name, description } = req.body;
    
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Folder name is required' });
    }
    
    // Check if a folder with this name already exists for this user
    const existingFolder = await prisma.folder.findFirst({
      where: {
        userId,
        name: {
          equals: name,
          mode: 'insensitive', // Case-insensitive comparison
        },
      },
    });
    
    if (existingFolder) {
      return res.status(400).json({ success: false, error: 'A folder with this name already exists' });
    }
    
    // Create the new folder
    const folder = await prisma.folder.create({
      data: {
        name,
        description: description || null,
        userId,
      },
    });
    
    return res.status(201).json({ success: true, data: folder });
  } catch (error) {
    console.error('Error creating folder:', error);
    return res.status(500).json({ success: false, error: 'Failed to create folder' });
  }
}
