import { NextResponse } from 'next/server';
import { db } from '@/db/client';
import { facebookGroups } from '@/db/schema';

export async function GET() {
  try {
    // Fetch all Facebook groups
    const groups = await db.select().from(facebookGroups);
    
    return NextResponse.json(groups);
  } catch (error) {
    console.error('Error fetching Facebook groups:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch Facebook groups' },
      { status: 500 }
    );
  }
} 