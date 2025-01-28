import { connectToDB } from "$lib/db";
import bcrypt from 'bcrypt';

export async function POST({ request }) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return new Response(JSON.stringify({ message: 'Invalid data'}), { status: 400 });
        }

        const db = await connectToDB();
        const usersCollection = db.collection('users');

        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return new Response(JSON.stringify({ message: 'User already exists' }), { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await usersCollection.insertOne({
            email,
            password: hashedPassword,
            createdAt: new Date()
        })

        return new Response(JSON.stringify({ message: 'User created' }), { status: 201 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 })
    }
}