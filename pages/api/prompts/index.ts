import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import { ApiResponse, PaginatedResponse } from '@/types';

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
      return getPrompts(req, res, userId);
    case 'POST':
      return createPrompt(req, res, userId);
    default:
      return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}

// GET: List all prompts for the authenticated user with filtering and pagination
async function getPrompts(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const {
      page = '1',
      pageSize = '20',
      folderId,
      tagIds,
      searchQuery,
      sortBy = 'createdAt',
      sortDirection = 'desc',
    } = req.query;
    
    // Parse pagination parameters
    const pageNum = parseInt(page as string, 10);
    const pageSizeNum = parseInt(pageSize as string, 10);
    const skip = (pageNum - 1) * pageSizeNum;
    
    // Build the where clause for filtering
    const where: any = { userId };
    
    // Filter by folder if provided
    if (folderId) {
      where.folderId = folderId as string;
    }
    
    // Filter by search query if provided
    if (searchQuery) {
      where.OR = [
        {
          title: {
            contains: searchQuery as string,
            mode: 'insensitive',
          },
        },
        {
          body: {
            contains: searchQuery as string,
            mode: 'insensitive',
          },
        },
      ];
    }
    
    // Filter by tags if provided
    if (tagIds) {
      const tagIdList = Array.isArray(tagIds) 
        ? tagIds as string[] 
        : [tagIds as string];
      
      where.promptTags = {
        some: {
          tagId: {
            in: tagIdList,
          },
        },
      };
    }
    
    // First, get the total count for pagination
    const total = await prisma.prompt.count({ where });
    
    // Then fetch the prompts with related data
    const prompts = await prisma.prompt.findMany({
      where,
      include: {
        folder: true,
        promptTags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        [sortBy as string]: sortDirection,
      },
      skip,
      take: pageSizeNum,
    });
    
    // Transform the data to include tags in a cleaner format
    const transformedPrompts = prompts.map(prompt => ({
      ...prompt,
      tags: prompt.promptTags.map(pt => pt.tag),
      promptTags: undefined, // Remove the promptTags property
    }));
    
    // Create the paginated response
    const response: PaginatedResponse<any> = {
      items: transformedPrompts,
      total,
      page: pageNum,
      pageSize: pageSizeNum,
      totalPages: Math.ceil(total / pageSizeNum),
    };
    
    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch prompts' });
  }
}

// POST: Create a new prompt
async function createPrompt(req: NextApiRequest, res: NextApiResponse, userId: string) {
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
    
    // Create the prompt
    const prompt = await prisma.prompt.create({
      data: {
        title,
        body,
        folderId,
        userId,
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
    const transformedPrompt = {
      ...prompt,
      tags: prompt.promptTags.map(pt => pt.tag),
      promptTags: undefined, // Remove the promptTags property
    };
    
    return res.status(201).json({ success: true, data: transformedPrompt });
  } catch (error) {
    console.error('Error creating prompt:', error);
    return res.status(500).json({ success: false, error: 'Failed to create prompt' });
  }
}
