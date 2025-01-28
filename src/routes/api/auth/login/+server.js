import { connectToDB } from "$lib/db";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ObjectId } from "mongodb";
import { JWT_SECRET, JWT_EXPIRES_IN, REFRESH_SECRET, REFRESH_EXPIRES_IN } from '$env/static/private';

export async function POST({ request, cookies }) {
    try {
        const { email, password } = await request.json();
        if (!email || !password) {
            return new Response(JSON.stringify({ message: 'Invalid data' }), { status: 400 })
        }

        const db = await connectToDB();
        const user = await db.collection('users').findOne({ email });
        if (!user) {
            return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 })
        }

        // Access Toekn 생성
        const accessSecret = JWT_SECRET;
        const accessExpiresIn = JWT_EXPIRES_IN || '900'; // 기본 900초

        const accessToken = jwt.sign(
            { userId: user._id.toString(), email: user.email },
            accessSecret,
            { expiresIn: accessExpiresIn+'s' }
        );

        // Refresh Token 생성
        const refreshSecret = REFRESH_SECRET;
        const refreshExpiresIn = REFRESH_EXPIRES_IN || '604800'; //기본 7일

        const refreshToken = jwt.sign(
            { userId: user._id.toString(), email: user.email },
            refreshSecret,
            { expiresIn: refreshExpiresIn+'s' }
        );

        await db.collection('users').updateOne(
            { _id: new ObjectId(user._id)},
            { $set: { refreshToken } }
        );

        cookies.set('accessToken', accessToken, {
            path: '/',
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: Number(accessExpiresIn)
        });
        cookies.set('refreshToken', refreshToken, {
            path: '/',
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: Number(refreshExpiresIn)
        });

        return new Response(JSON.stringify({ message: 'Logged in' }), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
    }
}