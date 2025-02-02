import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';

export const handle = async ({ event, resolve }) => {
    const { url } = event;
    if (url.pathname.includes('/api/auth/login') || url.pathname.includes('/api/auth/signup') || url.pathname.includes('/api/auth/refresh')) {
        return resolve(event);
    }

    const accessToken = event.cookies.get('accessToken');
    if (accessToken) {
        try {
            const decoded = jwt.verify(accessToken, JWT_SECRET);
            event.locals.user = {
                userId: decoded.userId,
                email: decoded.email
            };
        } catch (error) {
            console.log(error);
            event.locals.user = null;
        }
    } else {
        event.locals.user = null;
    }

    return resolve(event);
};

// export const handleError = async ({ error, event}) => {
//     const routeId = event.route?.id ?? '(no route)';

//     const errorMessage = typeof error === 'object' && error !== null
//     ? error.message || JSON.stringify(error)
//     : String(error);

//     console.error('[SERVER ERROR]', routeId, errorMessage);

//     return {
//         message: '서버 에러가 발생했습니다.',
//         code: 'UNKNOWN_ERROR'
//     };
// }