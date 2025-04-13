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
  const tagId = req.query.id as string;
  
  if (!tagId) {
    return res.status(400).json({ success: false, error: 'Tag ID is required' });
  }
  
  // Only DELETE is supported for this endpoint
  if (req.method !== 'DELETE') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  return deleteTag(req, res, userId, tagId);
}

// DELETE: Delete a tag and its associations
async function deleteTag(req: NextApiRequest, res: NextApiResponse, userId: string, tagId: string) {
  try {
    // Check if the tag exists and belongs to the user
    const existingTag = await prisma.tag.findFirst({
      where: {
        id: tagId,
        userId,
      },
    });
    
    if (!existingTag) {
      return res.status(404).json({ success: false, error: 'Tag not found' });
    }
    
    // First, delete all PromptTag connections for this tag
    await prisma.promptTag.deleteMany({
      where: {
        tagId,
      },
    });
    
    // Then delete the tag
    await prisma.tag.delete({
      where: {
        id: tagId,
      },
    });
    
    return res.status(200).json({ success: true, data: null });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete tag' });
  }
}
