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
  
  // Verify the prompt exists and belongs to the user
  const prompt = await prisma.prompt.findUnique({
    where: {
      id: promptId,
      userId,
    },
  });
  
  if (!prompt) {
    return res.status(404).json({ success: false, error: 'Prompt not found' });
  }
  
  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      return getTags(req, res, promptId);
    case 'POST':
      return addTag(req, res, promptId);
    default:
      return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}

// GET: List all tags for a prompt
async function getTags(req: NextApiRequest, res: NextApiResponse, promptId: string) {
  try {
    const promptTags = await prisma.promptTag.findMany({
      where: { promptId },
      include: { tag: true },
    });
    
    const tags = promptTags.map(pt => pt.tag);
    
    return res.status(200).json({ success: true, data: tags });
  } catch (error) {
    console.error('Error fetching tags for prompt:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch tags' });
  }
}

// POST: Add a tag to a prompt
async function addTag(req: NextApiRequest, res: NextApiResponse, promptId: string) {
  try {
    const { tagId } = req.body;
    
    if (!tagId) {
      return res.status(400).json({ success: false, error: 'Tag ID is required' });
    }
    
    // Check if the tag exists and belongs to the user
    const tag = await prisma.tag.findUnique({
      where: { id: tagId },
    });
    
    if (!tag) {
      return res.status(404).json({ success: false, error: 'Tag not found' });
    }
    
    // Check if the prompt-tag relationship already exists
    const existingPromptTag = await prisma.promptTag.findFirst({
      where: {
        promptId,
        tagId,
      },
    });
    
    if (existingPromptTag) {
      return res.status(200).json({ success: true, data: existingPromptTag });
    }
    
    // Create the new prompt-tag relationship
    const promptTag = await prisma.promptTag.create({
      data: {
        promptId,
        tagId,
      },
      include: {
        tag: true,
      },
    });
    
    return res.status(201).json({ success: true, data: promptTag });
  } catch (error) {
    console.error('Error adding tag to prompt:', error);
    return res.status(500).json({ success: false, error: 'Failed to add tag to prompt' });
  }
}
