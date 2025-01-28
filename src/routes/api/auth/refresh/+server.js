import { connectToDB } from '$lib/db';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { REFRESH_SECRET, JWT_SECRET, JWT_EXPIRES_IN } from '$env/static/private';

export async function POST({ cookies }) {
    try {
        const refreshToken = cookies.get('refreshToken');
        if (!refreshToken) {
            return new Response(JSON.stringify({ message: 'No refresh token' }), { status: 401 });
        }

        let decoded;
        try {
            decoded = jwt.verify(refreshToken, REFRESH_SECRET);
        } catch (error) {
            console.log(error);
            return new Response(JSON.stringify({ message: 'Invalid refresh token' }), { status: 401 });
        }

        const db = await connectToDB();
        const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });
        if (!user) {
            return new Response(JSON.stringify({ message: 'User not found' }), { status: 401 });
        }

        // db 저장 토큰과 비교
        if (!user.refreshToken || user.refreshToken !== refreshToken) {
            return new Response(JSON.stringify({ message: 'Invalid refresh token (mismatch)' }), { status: 401 });
        }

        // 새로운 Access Token 생성
        const accessSecret = JWT_SECRET;
        const accessExpiresIn = JWT_EXPIRES_IN || '900'; // 15분

        const newAccessToken = jwt.sign(
            { userId: user._id.toString(), email: user.email },
            accessSecret,
            { expiresIn: accessExpiresIn }
        );

        // 4) Access Token 쿠키 갱신
        cookies.set('accessToken', newAccessToken, {
            path: '/',
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: Number(accessExpiresIn)
        });
  
        return new Response(JSON.stringify({ message: 'Access token refreshed' }), { status: 200 });
    } catch (err) {
        console.log(err);
        return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
    }
}