import { getAuth } from "@/lib/services/auth.service";
import { getClientById } from "@/lib/services/client.service";
import { validateChallenge } from "@/lib/services/pcke.service";
import { getState } from "@/lib/services/state.service";
import { deleteCode, generateIdToken, IdTokenPayload, validCode } from "@/lib/services/token.service";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    const bodyText = await request.text()
    console.log(bodyText.split('&'))
    const bodyList = bodyText.split('&').map(item => item.split(/=(.+)/, 2))
    console.log(bodyList)

    const body = bodyList.reduce<{ code: string, code_verifier: string, client_id: string, grant_type: 'authorization_code', redirect_uri?: string }>((acc, [key, value]) => {
        return { ...acc, [key]: value }
    }, { code: '', code_verifier: '', client_id: '', grant_type: 'authorization_code', redirect_uri: '' })

    const { code, code_verifier, client_id, grant_type, redirect_uri } = body
    console.log(body)
    if (!code || !code_verifier) {
        return NextResponse.json({ message: 'Bad Request ' }, { status: 400 })
    }
    const auth = await getAuth(code + code_verifier)
    console.log(auth)
    const client = getClientById(client_id)
    if (!auth || !client) {
        return NextResponse.json({ message: 'Bad Request  ' }, { status: 400 })
    }

    const isValidCodeVerifier = validateChallenge(code_verifier);
    const isValidCode = validCode(code)

    const isValidClientId = client_id === auth.clientId
    const isValidGrantType = grant_type === 'authorization_code'
    const isValidRedirectUri = redirect_uri ? client.isAllowUrl(redirect_uri) : true

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