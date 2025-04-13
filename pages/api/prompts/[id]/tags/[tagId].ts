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
  const tagId = req.query.tagId as string;
  
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
    case 'DELETE':
      return removeTag(req, res, promptId, tagId);
    default:
      return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}

// DELETE: Remove a tag from a prompt
async function removeTag(req: NextApiRequest, res: NextApiResponse, promptId: string, tagId: string) {
  try {
    // Find the prompt-tag relationship
    const promptTag = await prisma.promptTag.findFirst({
      where: {
        promptId,
        tagId,
      },
    });
    
    if (!promptTag) {
      return res.status(404).json({ success: false, error: 'Tag not found on this prompt' });
    }
    
    // Delete the prompt-tag relationship
    await prisma.promptTag.delete({
      where: {
        id: promptTag.id,
      },
    });
    
    return res.status(200).json({ success: true, data: { message: 'Tag removed from prompt' } });
  } catch (error) {
    console.error('Error removing tag from prompt:', error);
    return res.status(500).json({ success: false, error: 'Failed to remove tag from prompt' });
  }
}
