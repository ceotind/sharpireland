import { NextResponse } from 'next/server';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { Industry } from '@/app/types/content';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const contentDir = path.join(process.cwd(), 'app/content/industries');
    const files = await fs.readdir(contentDir);
    const industries = await Promise.all(
      files
        .filter(file => file.endsWith('.json'))
        .map(async (file) => {
          const content = await fs.readFile(path.join(contentDir, file), 'utf-8');
          const industry = JSON.parse(content) as Industry;
          industry.slug = file.replace('.json', '');
          return industry;
        })
    );
    
    return NextResponse.json(industries);
  } catch (error) {
    console.error('Error loading industries:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}