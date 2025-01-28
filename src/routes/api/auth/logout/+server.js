import { connectToDB } from '$lib/db';
import { ObjectId } from 'mongodb';

export async function POST({ cookies, locals }) {
    try {
        if (!locals.user) {
            return new Response(JSON.stringify({ message: 'Already logged out' }), { status: 200 });
        }

        // db에서 제거
        const db = await connectToDB();
        await db.collection('users').updateOne(
            { _id: new ObjectId(locals.user.userId) },
            { $unset: { refreshToken: '' } }
        );

        // 쿠키 삭제
        cookies.delete('accessToken', { path: '/' });
        cookies.delete('refreshToken', { path: '/' });

        return new Response(JSON.stringify({ message: 'Logged out' }), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
    }
}