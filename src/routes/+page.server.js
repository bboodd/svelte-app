export async function load({ fetch }) {
    const res = await fetch('/api/questions');
    const questionList = await res.json();
    return { questionList };
}