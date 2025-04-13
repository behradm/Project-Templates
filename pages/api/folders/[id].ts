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
  const folderId = req.query.id as string;
  
  if (!folderId) {
    return res.status(400).json({ success: false, error: 'Folder ID is required' });
  }
  
  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      return getFolder(req, res, userId, folderId);
    case 'PUT':
      return updateFolder(req, res, userId, folderId);
    case 'DELETE':
      return deleteFolder(req, res, userId, folderId);
    default:
      return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}

// GET: Get a specific folder and its prompts
async function getFolder(req: NextApiRequest, res: NextApiResponse, userId: string, folderId: string) {
  try {
    // First, check if the folder exists and belongs to the user
    const folder = await prisma.folder.findFirst({
      where: {
        id: folderId,
        userId,
      },
      include: {
        prompts: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            promptTags: {
              include: {
                tag: true,
              },
            },
          },
        },
      },
    });
    
    if (!folder) {
      return res.status(404).json({ success: false, error: 'Folder not found' });
    }
    
    // Transform the prompts data to include tags in a cleaner format
    const transformedFolder = {
      ...folder,
      prompts: folder.prompts.map(prompt => ({
        ...prompt,
        tags: prompt.promptTags.map(pt => pt.tag),
        promptTags: undefined, // Remove the promptTags property
      })),
    };
    
    return res.status(200).json({ success: true, data: transformedFolder });
  } catch (error) {
    console.error('Error fetching folder:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch folder' });
  }
}

// PUT: Update a folder
async function updateFolder(req: NextApiRequest, res: NextApiResponse, userId: string, folderId: string) {
  try {
    const { name, description } = req.body;
    
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Folder name is required' });
    }
    
    // First, check if the folder exists and belongs to the user
    const existingFolder = await prisma.folder.findFirst({
      where: {
        id: folderId,
        userId,
      },
    });
    
    if (!existingFolder) {
      return res.status(404).json({ success: false, error: 'Folder not found' });
    }
    
    // Check if another folder with the same name exists (excluding this one)
    const duplicateFolder = await prisma.folder.findFirst({
      where: {
        userId,
        name: {
          equals: name,
          mode: 'insensitive', // Case-insensitive comparison
        },
        id: {
          not: folderId,
        },
      },
    });
    
    if (duplicateFolder) {
      return res.status(400).json({ success: false, error: 'Another folder with this name already exists' });
    }
    
    // Prevent changing the General folder's name
    if (existingFolder.name === 'General' && name !== 'General') {
      return res.status(400).json({ success: false, error: 'The General folder cannot be renamed' });
    }
    
    // Update the folder
    const updatedFolder = await prisma.folder.update({
      where: {
        id: folderId,
      },
      data: {
        name,
        description: description || null,
      },
    });
    
    return res.status(200).json({ success: true, data: updatedFolder });
  } catch (error) {
    console.error('Error updating folder:', error);
    return res.status(500).json({ success: false, error: 'Failed to update folder' });
  }
}

// DELETE: Delete a folder and move its prompts to General
async function deleteFolder(req: NextApiRequest, res: NextApiResponse, userId: string, folderId: string) {
  try {
    // First, check if the folder exists and belongs to the user
    const existingFolder = await prisma.folder.findFirst({
      where: {
        id: folderId,
        userId,
      },
    });
    
    if (!existingFolder) {
      return res.status(404).json({ success: false, error: 'Folder not found' });
    }
    
    // Prevent deleting the General folder
    if (existingFolder.name === 'General') {
      return res.status(400).json({ success: false, error: 'The General folder cannot be deleted' });
    }
    
    // Find the General folder
    const generalFolder = await prisma.folder.findFirst({
      where: {
        userId,
        name: 'General',
      },
    });
    
    if (!generalFolder) {
      return res.status(500).json({ success: false, error: 'General folder not found' });
    }
    
    // Move all prompts from the folder to be deleted to the General folder
    await prisma.prompt.updateMany({
      where: {
        folderId,
        userId,
      },
      data: {
        folderId: generalFolder.id,
      },
    });
    
    // Delete the folder
    await prisma.folder.delete({
      where: {
        id: folderId,
      },
    });
    
    return res.status(200).json({ success: true, data: null });
  } catch (error) {
    console.error('Error deleting folder:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete folder' });
  }
}
