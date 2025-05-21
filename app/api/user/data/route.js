import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import { getAuth } from '@/utils/firebase-admin';

export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');
    console.log('🔐 Auth header:', authHeader);

    const token = authHeader?.split('Bearer ')[1];
    if (!token) return NextResponse.json({ error: 'No token' }, { status: 401 });

    const decoded = await getAuth().verifyIdToken(token);
    console.log('✅ Firebase token decoded:', decoded);

    const uid = decoded.uid;

    const db = await connectToDatabase();
    console.log('🧠 Connected to MongoDB');

    const users = db.collection('users');
    let user = await users.findOne({ uid });
    console.log('🔍 MongoDB user lookup:', user);

    if (!user) {
      user = {
        uid,
        email: decoded.email,
        boosterPacks: ['starter'],
        createdAt: new Date(),
      };
      await users.insertOne(user);
      console.log('✨ Created new user in MongoDB');
    }

    return NextResponse.json(user);
  } catch (err) {
    console.error('🔥 API error:', err.message, err.stack);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
