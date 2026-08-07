import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import AboutContent from '@/models/AboutContent';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get('locale') || 'en';

    await connectToDatabase();
    
    const about = await AboutContent.findOne({ locale }).lean();
    if (!about) {
      return NextResponse.json({ 
        locale,
        badge: 'VENECOS PLATFORM',
        title: 'About Venecos', 
        subtitle: 'Empowering businesses worldwide with cutting-edge software & creative media.',
        heroImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop',
        heroVideo: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42890-large.mp4',
        content: 'Venecos brings together software engineers, 3D artists, video editors, and design visionaries.',
        storyTitle: 'Our Journey',
        missionTitle: 'Our Mission',
        missionDesc: 'Deliver world-class digital solutions driving real business growth.',
        visionTitle: 'Our Vision',
        visionDesc: 'To be the international standard for software craftsmanship and media.',
        stats: [
          { label: 'Projects Completed', value: '850+', icon: 'MdCheckCircle' },
          { label: 'Global Clients', value: '320+', icon: 'MdPeople' },
          { label: 'Countries Served', value: '18+', icon: 'MdPublic' },
          { label: 'Satisfaction Rate', value: '99.4%', icon: 'MdStar' }
        ],
        features: [
          { title: 'Custom Software Development', description: 'Full-stack web & mobile apps engineered for speed, scale, and high performance.' },
          { title: '3D & Motion Production', description: 'Photorealistic product rendering, motion graphics, and studio branding.' }
        ],
        galleryImages: [
          'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop'
        ],
        showcaseVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-working-on-a-laptop-42888-large.mp4'
      }, { status: 200 });
    }

    return NextResponse.json(about, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { 
      locale, 
      badge, 
      title, 
      subtitle, 
      heroImage, 
      heroVideo, 
      content, 
      storyTitle, 
      missionTitle, 
      missionDesc, 
      visionTitle, 
      visionDesc, 
      stats, 
      features, 
      galleryImages, 
      showcaseVideoUrl 
    } = body;

    if (!locale || !title || !content) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();

    const updatedAbout = await AboutContent.findOneAndUpdate(
      { locale },
      { 
        badge, 
        title, 
        subtitle, 
        heroImage, 
        heroVideo, 
        content, 
        storyTitle, 
        missionTitle, 
        missionDesc, 
        visionTitle, 
        visionDesc, 
        stats: Array.isArray(stats) ? stats : [], 
        features: Array.isArray(features) ? features : [], 
        galleryImages: Array.isArray(galleryImages) ? galleryImages : [], 
        showcaseVideoUrl 
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ message: 'About content updated successfully', data: updatedAbout }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Error updating content' }, { status: 500 });
  }
}
