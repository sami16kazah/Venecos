import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';
import Project from '@/models/Project';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    // Find all users with supervisor or admin role
    const supervisors = await User.find({ 
      roles: { $in: ['supervisor', 'admin'] } 
    }).select('-password').lean();

    // Map each supervisor with active orders & supervised projects counts
    const result = await Promise.all(supervisors.map(async (sup: any) => {
      const activeOrders = await Order.countDocuments({ 
        assignedId: sup._id, 
        status: { $ne: 'rejected' } 
      });
      const activeProjects = await Project.countDocuments({ 
        supervisorId: sup._id, 
        status: 'active' 
      });

      return {
        ...sup,
        activeOrdersCount: activeOrders || 0,
        activeProjectsCount: activeProjects || 0,
      };
    }));

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
