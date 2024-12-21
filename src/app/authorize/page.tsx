import { getClientById } from "@/lib/services/client.service";
import { isBadRequestQuery, OptionalAuthorizeQuery, RequiredAuthorizeQuery } from "./_validate/check-bad-request";
import { redirect } from "next/navigation";
import { createHash, randomBytes, randomUUID } from "crypto";
import { storeAuth } from "@/lib/services/auth.service";
import { storePkce } from "@/lib/services/pcke.service";



export default async function Page({ searchParams }: { searchParams: Promise<RequiredAuthorizeQuery & OptionalAuthorizeQuery> }) {
    console.log(await searchParams)
    const { client_id, response_type, redirect_uri, scope, state, nonce, code_challenge, code_challenge_method, audience } = await searchParams
    console.log(client_id)
    const client = getClientById(client_id);

    console.log(client)
    if (!client) {
        return <div>
            <p>不正なURLです</p>
        </div>
    }
    if (isBadRequestQuery({ client_id, response_type, redirect_uri, scope, state, nonce, audience, code_challenge, code_challenge_method })) {
        return <div>
            <p>不正なURLです</p>
        </div>
    }

    const code = randomUUID()
    const redirectUrlQuery = new URLSearchParams({ state, code }).toString()
    const redirectUrl = redirect_uri ?? client.allowRedirectUrls[0]
    const codeChallengeObj = code_challenge && code_challenge_method ? { code_challenge, code_challenge_method } : undefined

    let codeVerifier = ''
    if (codeChallengeObj) {
        const hash = createHash('sha256')
        hash.update(codeChallengeObj.code_challenge)
        codeVerifier = codeChallengeObj.code_challenge_method === 'S256' ? hash.digest('base64') : codeChallengeObj.code_challenge
        console.log(codeVerifier, 'codeVerifier')
        storePkce(codeVerifier)
    }
    await storeAuth(code + codeVerifier, { clientId: client.clientId, nonce, codeChallengeObj })

    return redirect(redirectUrl + `?${redirectUrlQuery}`)

}

// http://localhost:3002/authorize?client_id=d654d2fc-118b-8592-020a-f5b13c4eafbe&scope=openid+profile+email&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code&response_mode=query&state=a0lXRkg2Y0VVTTI4WmxON01rMUUtMkgzUTNJRDJSN0k2Ukpady5seXNtOA%3D%3D&nonce=aGRpWWxSVW9tLkFtUkd0M09Gai5PM3JYWFVsa0d1N25tcUlpLmpsbElGRg%3D%3D&code_challenge=fdVdFVAqFW73Og2UvTQFtigm0j3ZykGCWKpnAmEK67U&code_challenge_method=S256&auth0Client=eyJuYW1lIjoiYXV0aDAtcmVhY3QiLCJ2ZXJzaW9uIjoiMi4yLjAifQ%3D%3D