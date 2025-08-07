import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// PrismaClient singleton pattern for development
let prisma: PrismaClient;
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}

export const dynamic = "force-dynamic";

// GET all events, with optional filters for status/category
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const category = url.searchParams.get('category');
    const featured = url.searchParams.get('featured');
    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (featured) where.featured = featured === 'true';
    const events = await prisma.event.findMany({
      where,
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events', details: error }, { status: 500 });
  }
}

// POST create a new event
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // Basic validation (expand as needed)
    if (!data.title || !data.description || !data.date || !data.time || !data.location || !data.category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        time: data.time,
        location: data.location,
        category: data.category,
        status: data.status || 'upcoming',
        featured: !!data.featured,
        image: data.image,
      },
    });
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create event', details: error }, { status: 500 });
  }
}

// PATCH update an event by id
export async function PATCH(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.id) {
      return NextResponse.json({ error: 'Event ID required' }, { status: 400 });
    }
    const event = await prisma.event.update({
      where: { id: data.id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        maxAttendees: data.maxAttendees ? Number(data.maxAttendees) : undefined,
      },
    });
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update event', details: error }, { status: 500 });
  }
}

// DELETE an event by id
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Event ID required' }, { status: 400 });
    }
    const deleted = await prisma.event.delete({ where: { id } });
    return NextResponse.json(deleted);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete event', details: error }, { status: 500 });
  }
}