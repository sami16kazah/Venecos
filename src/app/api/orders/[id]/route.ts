import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-04-22.dahlia',
});

// Update an order's status (Admin only)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { status, assignedId, assignedName } = await req.json();

    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
    }

    await connectToDatabase();
    // Use dynamic import or ensure models are registered
    const User = (await import('@/models/User')).default;
    const Notification = (await import('@/models/Notification')).default;

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    let stripeCheckoutUrl = order.stripeCheckoutUrl;
    let stripeSessionId = order.stripeSessionId;

    // If accepting the order and it doesn't already have a checkout URL, generate one
    if (status === 'accepted' && !stripeCheckoutUrl) {
      try {
        const stripeSession = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: `${order.serviceName} - ${order.subServiceName}`,
                  description: `Services provided by Venecos for client ${order.customerDetails.firstName} ${order.customerDetails.lastName}`,
                },
                unit_amount: Math.round(order.price * 100),
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/en/dashboard?payment=success&orderId=${order._id}`,
          cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/en/dashboard?payment=cancelled`,
          client_reference_id: order._id.toString(),
          customer_email: order.customerDetails.email,
        });

        stripeCheckoutUrl = stripeSession.url ?? undefined;
        stripeSessionId = stripeSession.id;
      } catch (stripeErr: any) {
        console.error('Stripe error:', stripeErr);
        return NextResponse.json({ message: 'Failed to create payment session: ' + stripeErr.message }, { status: 500 });
      }
    }

    order.status = status;
    order.stripeCheckoutUrl = stripeCheckoutUrl;
    order.stripeSessionId = stripeSessionId;
    
    if (assignedId) {
      order.assignedId = assignedId;
      order.assignedName = assignedName;

      // Trigger Notifications
      try {
        // To Customer
        await Notification.create({
          userId: order.userId,
          title: 'Order Accepted & Assigned',
          message: `Great news! Your request for ${order.subServiceName} was accepted. ${assignedName} has been assigned to your project.`,
          link: `/dashboard`
        });

        // To Assigned Staff
        await Notification.create({
          userId: assignedId,
          title: 'New Assignment',
          message: `You have been assigned to handle order #${order._id.toString().slice(-6)} for ${order.customerDetails.firstName}.`,
          link: `/dashboard/orders` // We'll update this link later to staff orders page
        });
      } catch (notifyErr) {
        console.error('Notification error:', notifyErr);
      }
    }

    await order.save();

    return NextResponse.json({ message: 'Order updated', order }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    await Order.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Order deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
