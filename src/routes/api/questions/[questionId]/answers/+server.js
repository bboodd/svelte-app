import { connectToDB } from '$lib/db';
import { ObjectId } from 'mongodb';
import { json } from '@sveltejs/kit';

export const GET = async ({ params }) => {
    const { questionId } = params;
    const db = await connectToDB();
    const questionsCollection = db.collection('questions');
    const question = await questionsCollection.findOne({ _id: new ObjectId(questionId) });
    return json(question.answers);
};

export const POST = async ({ request, params }) => {
    const { content } = await request.json();
    if (!content) {
        return new Response(JSON.stringify({ message: 'Invalid data' }), { status: 400 });
    }

    const db = await connectToDB();
    const questionsCollection = db.collection('questions');

    const { questionId } = params;
    const qId = new ObjectId(questionId);
    const question = await questionsCollection.findOne({ _id: qId });
    if (!question) {
      return new Response(JSON.stringify({ message: 'Question not found' }), { status: 404 });
    }

    const answerId = new ObjectId(); // 답변별 고유 _id
    const result = await questionsCollection.updateOne(
      { _id: qId },
      {
        $push: {
          answers: {
            _id: answerId,
            content,
            createdAt: new Date()
          }
        }
      }
    );


    if (result.modifiedCount === 0) {
        return new Response(JSON.stringify({ message: 'Update failed' }), { status: 500 });
    }
  
    return new Response(
        JSON.stringify({ message: 'Answer added', answerId }),
        { status: 201 }
    );
}