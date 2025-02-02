import { error } from '@sveltejs/kit';

export const load = async ({ params, fetch }) => {
    const questionId = params.questionId;
    const res = await fetch(`/api/questions/${questionId}`);
    const question = await res.json();

    if (question) {
        return { question };
    }
    
    
    error(404, 'Not found');
}