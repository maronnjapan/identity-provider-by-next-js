import { getAuth } from "@/lib/services/auth.service";
import { validateChallenge } from "@/lib/services/pcke.service";
import { getState } from "@/lib/services/state.service";
import { deleteCode, generateIdToken, IdTokenPayload, validCode } from "@/lib/services/token.service";
import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

export async function POST(request: NextRequest) {
    const { code, state, code_verifier } = await request.json() as { code: string, state: string, code_verifier: string }

    if (!code || !state || !code_verifier) {
        return NextResponse.json({ message: 'Bad Request' }, { status: 400 })
    }
    const auth = getAuth(state + code_verifier)
    if (!auth) {
        return NextResponse.json({ message: 'Bad Request' }, { status: 400 })
    }

    const isValidState = !!getState(state)
    const isValidCodeVerifier = validateChallenge(code_verifier);
    const isValidCode = validCode(code)
    if (!isValidState || !isValidCodeVerifier || !isValidCode) {
        return NextResponse.json({ message: 'Bad Request' }, { status: 400 })
    }



    deleteCode(code)

    const apiUrl = new URL(request.url)

    const nonceObj = auth.nonce ? { nonce: auth.nonce } : {}

    const idTokenPayload: IdTokenPayload = {
        iss: apiUrl.origin,
        sub: '1234567890',
        name: 'John Doe',
        email: 'john.doe@example.com',
        iat: Date.now(),
        exp: Date.now() + 3600,
        aud: auth.clientId,
        auth_time: Date.now(),
        ...nonceObj
    }
    return NextResponse.json({ access_token: 'opaque', expires_in: 3600, id_token: generateIdToken(idTokenPayload) }, { status: 200, headers: corsHeaders })
}