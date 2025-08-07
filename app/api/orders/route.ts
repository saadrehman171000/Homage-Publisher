import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Order as PrismaOrder } from '@prisma/client';
import { 
  sendOrderConfirmationEmail, 
  sendShippingNotificationEmail, 
  sendDeliveryConfirmationEmail,
  sendNewOrderNotificationEmail
} from '@/lib/sendOrderEmail';

const prisma = new PrismaClient();

// Allowed statuses for orders
const ALLOWED_STATUSES = [
  'Pending Approval',
  'Approved',
  'Out for Delivery',
  'Delivered',
];

// Type for order creation
interface OrderInput {
  items: any[];
  subtotal: number;
  shippingFee: number;
  total: number;
  shippingName: string;
  shippingEmail: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingDistrict?: string;
  shippingPostalCode: string;
  paymentMethod?: string;
}

function validateOrderInput(data: any): data is OrderInput {
  return (
    Array.isArray(data.items) &&
    typeof data.total === 'number' &&
    typeof data.subtotal === 'number' &&
    typeof data.shippingFee === 'number' &&
    typeof data.shippingName === 'string' &&
    typeof data.shippingEmail === 'string' &&
    typeof data.shippingPhone === 'string' &&
    typeof data.shippingAddress === 'string' &&
    typeof data.shippingCity === 'string' &&
    typeof data.shippingPostalCode === 'string'
  );
}

// GET all orders
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const email = url.searchParams.get('email');
  const phone = url.searchParams.get('phone');
  if (email || phone) {
    const where: any = {};
    if (email) where.shippingEmail = email;
    if (phone) where.shippingPhone = phone;
    const orders = await prisma.order.findMany({ where, orderBy: { createdAt: 'desc' } });
    return NextResponse.json(orders);
  }
  // Default: return all orders (admin)
  const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(orders);
}

// CREATE a new order (COD)
export async function POST(req: NextRequest) {
  const data = await req.json();
  if (!validateOrderInput(data)) {
    return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
  }

  // Validate minimum order amount
  const MINIMUM_ORDER_AMOUNT = 1000;
  if (data.subtotal < MINIMUM_ORDER_AMOUNT) {
    return NextResponse.json({ 
      error: `Minimum order amount is Rs. ${MINIMUM_ORDER_AMOUNT}. Current subtotal: Rs. ${data.subtotal}` 
    }, { status: 400 });
  }

  // Set status: 'Pending' for each item
  const itemsWithStatus = data.items.map((item: any) => ({ ...item, status: 'Pending' }));
  
  const order = await prisma.order.create({
    data: {
      items: itemsWithStatus,
      total: data.total,
      status: 'Pending Approval', // Always set for new orders
      shippingName: data.shippingName,
      shippingEmail: data.shippingEmail,
      shippingPhone: data.shippingPhone,
      shippingAddress: `${data.shippingAddress}, ${data.shippingDistrict || ''}, ${data.shippingCity}`.trim().replace(/,\s*,/g, ','),
      shippingCity: data.shippingCity,
      shippingPostalCode: data.shippingPostalCode,
    },
  });

  // Send admin notification email (don't wait for it to complete)
  try {
    console.log('Sending admin notification email for new order:', order.id);
    await sendNewOrderNotificationEmail(order);
    console.log('Admin notification email sent successfully');
  } catch (error) {
    console.error('Failed to send admin notification email:', error);
    // Don't fail the order creation if email fails
  }
  
  return NextResponse.json(order);
}

// PATCH: Update order status or item status
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  
  // Update whole order status
  if (body.id && body.status && !body.itemIndex) {
    // Get the current order to check previous status
    const currentOrder = await prisma.order.findUnique({ where: { id: body.id } });
    if (!currentOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = await prisma.order.update({
      where: { id: body.id },
      data: { status: body.status },
    });

    // Send email notifications based on status change
    // Only send email if status has actually changed
    if (currentOrder.status !== body.status) {
      console.log(`Order status changed from "${currentOrder.status}" to "${body.status}"`);
      
      try {
        switch (body.status) {
          case "Approved":
            console.log('Sending order confirmation email to:', order.shippingEmail);
            await sendOrderConfirmationEmail(order);
            console.log('Order confirmation email sent successfully');
            break;
            
          case "Out for Delivery":
            console.log('Sending shipping notification email to:', order.shippingEmail);
            await sendShippingNotificationEmail(order);
            console.log('Shipping notification email sent successfully');
            break;
            
          case "Delivered":
            console.log('Sending delivery confirmation email to:', order.shippingEmail);
            await sendDeliveryConfirmationEmail(order);
            console.log('Delivery confirmation email sent successfully');
            break;
            
          default:
            console.log(`No email notification configured for status: ${body.status}`);
        }
      } catch (error) {
        console.error('Error sending email notification:', error);
        // Don't fail the order update if email fails
      }
    }

    return NextResponse.json(order);
  }
  
  // Update item status
  if (body.id && typeof body.itemIndex === 'number' && body.itemStatus) {
    const order = await prisma.order.findUnique({ where: { id: body.id } });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    const items = order.items as any[];
    items[body.itemIndex].status = body.itemStatus;
    // Recalculate overall order status
    let overallStatus = 'Pending Approval';
    const statuses = items.map(i => i.status);
    if (statuses.every(s => s === 'Approved')) overallStatus = 'Approved';
    else if (statuses.every(s => s === 'Rejected')) overallStatus = 'Rejected';
    else if (statuses.some(s => s === 'Pending')) overallStatus = 'Pending Approval';
    else overallStatus = 'Partially Approved';
    const updated = await prisma.order.update({
      where: { id: body.id },
      data: { items, status: overallStatus },
    });
    return NextResponse.json(updated);
  }
  
  return NextResponse.json({ error: 'Invalid PATCH request' }, { status: 400 });
}

// DELETE: Delete order by ID
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
  const deleted = await prisma.order.delete({ where: { id } });
  return NextResponse.json(deleted);
} 