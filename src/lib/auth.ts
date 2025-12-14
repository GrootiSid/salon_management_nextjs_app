import { hash, compare } from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'supersecretkey123!@#');

export async function hashPassword(password: string) {
    return await hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
    return await compare(password, hash);
}

export async function signToken(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(KEY);
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, KEY);
        return payload;
    } catch (e) {
        return null;
    }
}
