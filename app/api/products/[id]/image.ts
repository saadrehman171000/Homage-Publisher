import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product || !product.imageData) {
      // Optionally serve a placeholder image
      return new NextResponse('Not found', { status: 404 });
    }
    return new NextResponse(product.imageData, {
      status: 200,
      headers: {
        'Content-Type': 'image/png', // or detect type
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    return new NextResponse('Error', { status: 500 });
  }
} 