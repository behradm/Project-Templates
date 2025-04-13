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
  
  // Only POST is supported for this endpoint
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  // Get the prompt ID from the request body
  const { promptId } = req.body;
  
  if (!promptId) {
    return res.status(400).json({ success: false, error: 'Prompt ID is required' });
  }
  
  try {
    // Check if the prompt exists and belongs to the user
    const prompt = await prisma.prompt.findFirst({
      where: {
        id: promptId,
        userId: session.user.id,
      },
    });
    
    if (!prompt) {
      return res.status(404).json({ success: false, error: 'Prompt not found' });
    }
    
    // Increment the copy count
    const updatedPrompt = await prisma.prompt.update({
      where: {
        id: promptId,
      },
      data: {
        copyCount: {
          increment: 1,
        },
      },
    });
    
    return res.status(200).json({ success: true, data: updatedPrompt });
  } catch (error) {
    console.error('Error incrementing copy count:', error);
    return res.status(500).json({ success: false, error: 'Failed to increment copy count' });
  }
}
