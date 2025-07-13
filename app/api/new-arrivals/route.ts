import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all new arrivals
export async function GET() {
  const newArrivals = await prisma.product.findMany({ where: { isNewArrival: true } });
  return NextResponse.json(newArrivals);
} 