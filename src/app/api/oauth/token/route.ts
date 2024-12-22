import { deleteAuth, getAuth } from "@/lib/services/auth.service";
import { getClientById } from "@/lib/services/client.service";
import { validateChallenge } from "@/lib/services/pcke.service";
import { getState } from "@/lib/services/state.service";
import { deleteCode, generateIdToken, IdTokenPayload, validCode } from "@/lib/services/token.service";
import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    const bodyText = await request.text()
    const bodyList = bodyText.split('&').map(item => item.split(/=(.+)/, 2))

    const body = bodyList.reduce<{ code: string, code_verifier?: string, client_id: string, grant_type?: 'authorization_code', redirect_uri?: string }>((acc, [key, value]) => {
        return { ...acc, [key]: value }
    }, { code: '', code_verifier: undefined, client_id: '', grant_type: undefined, redirect_uri: undefined })

    const { code, code_verifier, client_id, grant_type, redirect_uri } = body
    if (!code) {
        return NextResponse.json({ message: 'Bad Request ' }, { status: 400 })
    }

    const client = getClientById(client_id)
    if (!client) {
        return NextResponse.json({ message: 'Bad Request  ' }, { status: 400 })
    }

    const auth = await getAuth(code + client.clientId)
    if (!auth) {
        return NextResponse.json({ message: 'Bad Request  ' }, { status: 400 })
    }


    const digestBufferOrString = code_verifier && auth.codeChallengeObj?.code_challenge_method === 'S256' ?
        await crypto.subtle.digest(
            { name: 'SHA-256' },
            new TextEncoder().encode(code_verifier)
        )
        : code_verifier


    const digest = typeof digestBufferOrString === 'string' ? digestBufferOrString : bufferToBase64UrlEncoded(digestBufferOrString)

    const isValidCodeVerifier = digest ? await validateChallenge(digest) : true;
    const isValidCode = await validCode(code)

    const isValidClientId = client_id === auth.clientId
    const isValidGrantType = grant_type === 'authorization_code'
    const isValidRedirectUri = redirect_uri ? client.isAllowUrl(decodeURIComponent(redirect_uri)) : true

    if (!isValidCodeVerifier || !isValidCode || !isValidClientId || !isValidGrantType || !isValidRedirectUri) {
        return NextResponse.json({ message: 'Bad Request   ' }, { status: 400 })
    }

    deleteCode(code)
    deleteAuth(code + client.clientId)

    const apiUrl = new URL(request.url)

    const nonceObj = auth.nonce ? { nonce: auth.nonce } : {}

    const idTokenPayload: IdTokenPayload = {
        iss: `${apiUrl.origin}/`,
        sub: '1234567890',
        name: 'John Doe',
        email: 'john.doe@example.com',
        iat: Date.now(),
        exp: Date.now() + 3600,
        aud: auth.clientId,
        ...nonceObj
    }

    const idToken = auth.isPublishIdToken ? generateIdToken(idTokenPayload) : undefined

    return NextResponse.json({ access_token: 'opaque', token_type: "Bearer", expires_in: 3600, id_token: idToken }, { status: 200 })
}

const bufferToBase64UrlEncoded = (input?: ArrayBuffer) => {
    if (!input) {
        return undefined
    }
    const ie11SafeInput = new Uint8Array(input);
    return urlEncodeB64(
        btoa(String.fromCharCode(...Array.from(ie11SafeInput)))
    );
};
const urlEncodeB64 = (input: string) => {
    const b64Chars: { [index: string]: string } = { '+': '-', '/': '_', '=': '' };
    return input.replace(/[+/=]/g, (m: string) => b64Chars[m]);
};