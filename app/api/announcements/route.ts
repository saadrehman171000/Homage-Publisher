import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all announcements
export async function GET() {
  const announcements = await prisma.announcement.findMany();
  return NextResponse.json(announcements);
}

// CREATE a new announcement
export async function POST(req: NextRequest) {
  const data = await req.json();
  const announcement = await prisma.announcement.create({ data });
  return NextResponse.json(announcement);
} 