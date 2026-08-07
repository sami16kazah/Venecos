import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any)?.id;
    const role = (session.user as any)?.role || 'client';
    const userEmail = session.user?.email;

    await connectToDatabase();

    let query: any = {};
    if (role === 'client') {
      query = {
        $or: [
          { clientId: userId },
          { clientName: session.user?.name },
        ]
      };
    } else if (role === 'employee') {
      query = {
        $or: [
          { employeeId: userId },
          { employeeName: session.user?.name },
        ]
      };
    }

    const projects = await Project.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json(projects, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'supervisor'].includes((session.user as any)?.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    await connectToDatabase();

    const count = await Project.countDocuments();
    const projectNumber = `#PRJ-${String(count + 1).padStart(4, '0')}`;

    const project = await Project.create({
      ...body,
      projectNumber,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
