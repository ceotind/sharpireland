import { NextResponse } from 'next/server';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { Industry } from '@/app/types/content';

export const runtime = 'nodejs';

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { params: awaitedParams } = context;
    const { slug } = await awaitedParams;
    const filePath = path.join(process.cwd(), 'app/content/industries', `${slug}.json`);
    
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const industry = JSON.parse(content) as Industry;
      industry.slug = slug;
      return NextResponse.json(industry);
    } catch (error) {
      console.error(`Industry not found: ${slug}`, error);
      return NextResponse.json({ error: 'Industry not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error loading industry:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}