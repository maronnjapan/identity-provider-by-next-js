import { postAuthorize, PostAuthorizeBody } from "@/apis"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const client_id = searchParams.get("client_id");
    const response_type = searchParams.get("response_type");
    const redirect_uri = searchParams.get("redirect_uri");
    const scope = searchParams.get("scope");
    const state = searchParams.get("state");
    const nonce = searchParams.get("nonce");
    const code_challenge = searchParams.get("code_challenge");
    const code_challenge_method = searchParams.get("code_challenge_method");

    if (!client_id || !response_type || !redirect_uri || !state || !nonce || !code_challenge || !code_challenge_method) {
        return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const codeChallengeMethodOptions = ['S256', 'plain'] as const;
    const codeChallengeMethod = codeChallengeMethodOptions.find((v) => v === code_challenge_method);

    if (response_type !== 'code' || !codeChallengeMethod) {
        return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const cookieStore = await cookies();

    console.log(cookieStore.get("auth_info"), 'cookieStore.get("auth_info")')

    const body: PostAuthorizeBody = { client_id, response_type, redirect_uri, scope: scope ?? '', state, nonce, code_challenge, code_challenge_method: codeChallengeMethod, grant_type: 'authorization_code' }
    const res = await postAuthorize(body)

    const { code, redirect_uri: resRedirectUri, state: resState } = res.data
    const redirectUrlQuery = new URLSearchParams({ code, state: resState }).toString()

    cookieStore.set("auth_info2", 'aaabbbcccc', {
        path: "/authorize",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: "strict",
        secure: true,
    });
    const response = NextResponse.redirect(resRedirectUri + `?${redirectUrlQuery}`, { status: 302 });

    return response;
}

