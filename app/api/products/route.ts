import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all products (with pagination support)
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pageParam = url.searchParams.get('page');
    const limitParam = url.searchParams.get('limit');
    const allParam = url.searchParams.get('all'); // For when we want all products
    
    // If 'all' parameter is present, return all products (for dropdowns, etc.)
    if (allParam === 'true') {
      const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json(products);
    }
    
    // Pagination parameters
    const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
    const limit = limitParam ? parseInt(limitParam, 10) : 16; // Default 16 per page
    const skip = (page - 1) * limit;
    
    // Get total count for pagination
    const total = await prisma.product.count();
    
    // Get paginated products
    const products = await prisma.product.findMany({
      skip: skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    return NextResponse.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts: total,
        hasNextPage,
        hasPrevPage,
        limit
      }
    });
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