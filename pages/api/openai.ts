import type { NextApiRequest, NextApiResponse } from 'next'
import { OpenAI } from 'openai'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'

type ResponseData = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Check for authentication
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { prompt } = req.body

  if (!prompt) {
    return res.status(400).json({ message: 'No prompt provided' })
  }

  // Initialize OpenAI client
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ message: 'OpenAI API key not configured' })
  }

  try {
    const openai = new OpenAI({ apiKey })
    
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4',
    })

    const responseMessage = completion.choices[0]?.message?.content || 'No response from OpenAI'
    
    return res.status(200).json({ message: responseMessage })
  } catch (error: any) {
    console.error('OpenAI API error:', error)
    return res.status(500).json({ 
      message: error.message || 'Error calling OpenAI API'
    })
  }
}
