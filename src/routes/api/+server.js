import { json } from '@sveltejs/kit';

export function GET() {
    const hello = "hello world!";

    return json(hello);
}