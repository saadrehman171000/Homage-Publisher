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

// PATCH: Update an announcement
export async function PATCH(req: NextRequest) {
  const data = await req.json();
  const { id, ...updateData } = data;
  if (!id) {
    return NextResponse.json({ error: "Announcement ID required" }, { status: 400 });
  }
  const updated = await prisma.announcement.update({
    where: { id },
    data: updateData,
  });
  return NextResponse.json(updated);
}

// DELETE: Delete an announcement
export async function DELETE(req: NextRequest) {
  const data = await req.json();
  const { id } = data;
  if (!id) {
    return NextResponse.json({ error: "Announcement ID required" }, { status: 400 });
  }
  await prisma.announcement.delete({ where: { id } });
  return NextResponse.json({ success: true });
} 