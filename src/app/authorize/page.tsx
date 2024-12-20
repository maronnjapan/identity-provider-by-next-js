import { getClientById } from "@/lib/services/client.service";
import { isBadRequestQuery, OptionalAuthorizeQuery, RequiredAuthorizeQuery } from "./_validate/check-bad-request";
import { redirect } from "next/navigation";
import { randomBytes, randomUUID } from "crypto";
import { storeAuth } from "@/lib/services/auth.service";



export default async function Page({ params }: { params: Promise<RequiredAuthorizeQuery & OptionalAuthorizeQuery> }) {
    const { client_id, response_type, redirect_uri, scope, state, nonce, code_verifier, audience } = await params
    const client = getClientById(client_id);

    if (!client) {
        return <div>
            <p>不正なURLです</p>
        </div>
    }
    if (!isBadRequestQuery({ client_id, response_type, redirect_uri, scope, state, nonce, audience, code_verifier })) {
        return <div>
            <p>不正なURLです</p>
        </div>
    }

    const code = randomUUID()
    const redirectUrlQuery = new URLSearchParams({ state, code }).toString()
    storeAuth(state + (code_verifier ?? ''), { clientId: client.clientId, nonce })
    return redirect(redirect_uri ?? client.allowRedirectUrls[0] + `?${redirectUrlQuery}`)

}

