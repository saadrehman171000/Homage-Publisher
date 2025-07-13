import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all orders
export async function GET() {
  const orders = await prisma.order.findMany();
  return NextResponse.json(orders);
}

// CREATE a new order
export async function POST(req: NextRequest) {
  const data = await req.json();
  const order = await prisma.order.create({ data });
  return NextResponse.json(order);
} 