import { getAuth } from "@/lib/services/auth.service";
import { getClientById } from "@/lib/services/client.service";
import { validateChallenge } from "@/lib/services/pcke.service";
import { getState } from "@/lib/services/state.service";
import { deleteCode, generateIdToken, IdTokenPayload, validCode } from "@/lib/services/token.service";
import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    const bodyText = await request.text()
    console.log(bodyText.split('&'))
    const bodyList = bodyText.split('&').map(item => item.split(/=(.+)/, 2))
    console.log(bodyList)

    const body = bodyList.reduce<{ code: string, code_verifier?: string, client_id: string, grant_type: 'authorization_code', redirect_uri?: string }>((acc, [key, value]) => {
        return { ...acc, [key]: value }
    }, { code: '', code_verifier: undefined, client_id: '', grant_type: 'authorization_code', redirect_uri: undefined })

    const { code, code_verifier, client_id, grant_type, redirect_uri } = body
    console.log(body)
    if (!code) {
        return NextResponse.json({ message: 'Bad Request ' }, { status: 400 })
    }

    const client = getClientById(client_id)
    if (!client) {
        return NextResponse.json({ message: 'Bad Request  ' }, { status: 400 })
    }

    const auth = await getAuth(code + client.clientId)
    console.log(auth)
    if (!auth) {
        return NextResponse.json({ message: 'Bad Request  ' }, { status: 400 })
    }


    const hash = createHash('sha256')
    if (code_verifier && auth.codeChallengeObj?.code_challenge_method === 'S256') {
        hash.update(code_verifier)
    }
    const codeChallenge = auth.codeChallengeObj?.code_challenge
    console.log(codeChallenge, 'codeChallenge')
    console.log(hash.digest('base64'), "hash.digest('base64')")
    const isValidCodeVerifier = code_verifier ? await validateChallenge(auth.codeChallengeObj?.code_challenge_method === 'S256' ? hash.digest('base64') : code_verifier) : true;
    const isValidCode = await validCode(code)

    const isValidClientId = client_id === auth.clientId
    const isValidGrantType = grant_type === 'authorization_code'
    const isValidRedirectUri = redirect_uri ? client.isAllowUrl(decodeURIComponent(redirect_uri)) : true

    console.log(decodeURIComponent(redirect_uri ?? ''))
    console.log(isValidCodeVerifier, isValidCode, isValidClientId, isValidGrantType, isValidRedirectUri)
    if (!isValidCodeVerifier || !isValidCode || !isValidClientId || !isValidGrantType || !isValidRedirectUri) {
        return NextResponse.json({ message: 'Bad Request   ' }, { status: 400 })
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

    return NextResponse.json({ access_token: 'opaque', expires_in: 3600, id_token: generateIdToken(idTokenPayload) }, { status: 200 })
}