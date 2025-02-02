import { connectToDB } from '$lib/db.js';
import { json } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

export const GET = async ({ params }) => {
    const db = await connectToDB();
    const collection = db.collection('questions');
    const question = await collection.findOne({ _id: new ObjectId(params.questionId) });
    
    return json(question);
} 