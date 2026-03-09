import { NextRequest } from 'next/server';
import { storage } from '@/lib/storage';

export async function POST(req: NextRequest) {
  const { key, contentType } = await req.json();
  
  if (!key || !contentType) {
    return Response.json({ error: 'Missing key or contentType' }, { status: 400 });
  }

  try {
    const url = await storage.getUploadUrl(key, contentType);
    return Response.json({ url, key });
  } catch (error) {
    return Response.json({ error: 'Failed to generate upload URL' }, { status: 500 });
  }
}
