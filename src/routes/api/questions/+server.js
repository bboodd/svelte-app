import { connectToDB } from "$lib/db";
import { json } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";

export async function GET() {
    const db = await connectToDB();
    const questionsCollection = db.collection('questions');
    const questions = await questionsCollection.find().sort({ "createdAt": -1 }).toArray();
    return json(questions);
}

export const POST = async ({ request }) => {
    const { subject, content } = await request.json();

    if (!subject || !content) {
        error(400, 'Bad Request');
    }

    const db = await connectToDB();
    const questionCollection = db.collection('questions');
    const result = await questionCollection.insertOne({
        subject,
        content,
        createdAt: new Date()
    })

    return new Response(JSON.stringify({
        message: 'Question Created',
        questionId: result.insertedId
    }), { status: 201 })
}
