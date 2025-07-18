import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all products (with optional limit)
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const limitParam = url.searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 12;
    const products = await prisma.product.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// CREATE a new product
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const product = await prisma.product.create({
      data: {
        title: body.title,
        description: body.description,
        price: body.price,
        discount: body.discount,
        imageUrl: body.image,
        category: body.category,
        subject: body.subject,
        series: body.series,
        type: body.type,
        isNewArrival: body.isNewArrival,
        isFeatured: body.isFeatured,
        rating: body.rating,
        reviews: body.reviews,
      },
    });
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 