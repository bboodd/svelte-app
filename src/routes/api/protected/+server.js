export async function GET({ locals }) {
    if (!locals.user) {
        return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    return new Response(JSON.stringify({
        message: `Hello, your email is ${locals.user.email}`
    }), { status: 200 });
}