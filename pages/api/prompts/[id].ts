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
  const promptId = req.query.id as string;
  
  if (!promptId) {
    return res.status(400).json({ success: false, error: 'Prompt ID is required' });
  }
  
  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      return getPrompt(req, res, userId, promptId);
    case 'PUT':
      return updatePrompt(req, res, userId, promptId);
    case 'DELETE':
      return deletePrompt(req, res, userId, promptId);
    default:
      return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}

// GET: Get a specific prompt
async function getPrompt(req: NextApiRequest, res: NextApiResponse, userId: string, promptId: string) {
  try {
    // Check if the prompt exists and belongs to the user
    const prompt = await prisma.prompt.findFirst({
      where: {
        id: promptId,
        userId,
      },
      include: {
        folder: true,
        promptTags: {
          include: {
            tag: true,
          },
        },
      },
    });
    
    if (!prompt) {
      return res.status(404).json({ success: false, error: 'Prompt not found' });
    }
    
    // Transform the data to include tags in a cleaner format
    const { promptTags, ...promptData } = prompt;
    const transformedPrompt = {
      ...promptData,
      tags: promptTags.map(pt => pt.tag)
    };
    
    return res.status(200).json({ success: true, data: transformedPrompt });
  } catch (error) {
    console.error('Error fetching prompt:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch prompt' });
  }
}

// PUT: Update a prompt
async function updatePrompt(req: NextApiRequest, res: NextApiResponse, userId: string, promptId: string) {
  try {
    const { title, body, folderId, tagIds = [] } = req.body;
    
    // Validate required fields
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }
    
    if (!body || typeof body !== 'string' || !body.trim()) {
      return res.status(400).json({ success: false, error: 'Prompt body is required' });
    }
    
    if (!folderId) {
      return res.status(400).json({ success: false, error: 'Folder is required' });
    }
    
    // Check if the prompt exists and belongs to the user
    const existingPrompt = await prisma.prompt.findFirst({
      where: {
        id: promptId,
        userId,
      },
    });
    
    if (!existingPrompt) {
      return res.status(404).json({ success: false, error: 'Prompt not found' });
    }
    
    // Check if the folder exists and belongs to the user
    const folder = await prisma.folder.findFirst({
      where: {
        id: folderId as string,
        userId,
      },
    });
    
    if (!folder) {
      return res.status(400).json({ success: false, error: 'Invalid folder' });
    }
    
    // First, delete all existing tag connections
    await prisma.promptTag.deleteMany({
      where: {
        promptId,
      },
    });
    
    // Update the prompt and create new tag connections
    const updatedPrompt = await prisma.prompt.update({
      where: {
        id: promptId,
      },
      data: {
        title,
        body,
        folderId,
        // Create tag connections if tagIds are provided
        promptTags: {
          create: tagIds.map((tagId: string) => ({
            tag: {
              connect: {
                id: tagId,
              },
            },
          })),
        },
      },
      include: {
        folder: true,
        promptTags: {
          include: {
            tag: true,
          },
        },
      },
    });
    
    // Transform the data to include tags in a cleaner format  
    const { promptTags, ...promptData } = updatedPrompt;
    const transformedPrompt = {
      ...promptData,
      tags: promptTags.map(pt => pt.tag)
    };
    
    return res.status(200).json({ success: true, data: transformedPrompt });
  } catch (error) {
    console.error('Error updating prompt:', error);
    return res.status(500).json({ success: false, error: 'Failed to update prompt' });
  }
}

// DELETE: Delete a prompt
async function deletePrompt(req: NextApiRequest, res: NextApiResponse, userId: string, promptId: string) {
  try {
    // Check if the prompt exists and belongs to the user
    const existingPrompt = await prisma.prompt.findFirst({
      where: {
        id: promptId,
        userId,
      },
    });
    
    if (!existingPrompt) {
      return res.status(404).json({ success: false, error: 'Prompt not found' });
    }
    
    // Delete the prompt
    await prisma.prompt.delete({
      where: {
        id: promptId,
      },
    });
    
    return res.status(200).json({ success: true, data: null });
  } catch (error) {
    console.error('Error deleting prompt:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete prompt' });
  }
}
