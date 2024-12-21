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
    if (!isBadRequestQuery({ client_id, response_type, redirect_uri, scope, state, nonce, audience, code_challenge, code_challenge_method })) {
        return <div>
            <p>不正なURLです</p>
        </div>
    }

    const code = randomUUID()
    const redirectUrlQuery = new URLSearchParams({ state, code }).toString()
    const codeChallengeObj = code_challenge && code_challenge_method ? { code_challenge, code_challenge_method } : undefined
    if (codeChallengeObj) {
        const hash = createHash('sha256')
        hash.update(codeChallengeObj.code_challenge)
        storePkce(codeChallengeObj.code_challenge_method === 'S256' ? hash.digest('base64') : codeChallengeObj.code_challenge)
    }
    storeAuth(state + (code_challenge ?? ''), { clientId: client.clientId, nonce, codeChallengeObj })
    return redirect(redirect_uri ?? client.allowRedirectUrls[0] + `?${redirectUrlQuery}`)

}

