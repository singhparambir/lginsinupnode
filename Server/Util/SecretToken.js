// import jwt from 'jsonwebtoken';

// export function createSecretToken(id) {
//     return jwt.sign({ id }, process.env.TOKEN_KEY, {
//         expiresIn: '3d', // '3d' is more readable and equivalent to 3 * 24 * 60 * 60
//     });
// }


import jwt from 'jsonwebtoken';

export function createSecretToken(id) {
    const secretKey = process.env.TOKEN_KEY;
    if (!secretKey) {
        throw new Error('JWT secret key (TOKEN_KEY) is not defined');
    }
    return jwt.sign({ id }, secretKey, { expiresIn: '3d' });
}
