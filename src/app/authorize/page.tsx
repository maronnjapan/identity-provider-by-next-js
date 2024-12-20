import { getClientById } from "@/lib/services/client.service";
import { isBadRequestQuery, OptionalAuthorizeQuery, RequiredAuthorizeQuery } from "./_validate/check-bad-request";
import { redirect } from "next/navigation";
import { randomBytes, randomUUID } from "crypto";
import { storeAuth } from "@/lib/services/auth.service";



export default function Home({ searchParams }: { searchParams: RequiredAuthorizeQuery & OptionalAuthorizeQuery }) {
    const client = getClientById(searchParams.client_id);

    if (!client) {
        return <div>
            <p>不正なURLです</p>
        </div>
    }
    if (!isBadRequestQuery(searchParams)) {
        return <div>
            <p>不正なURLです</p>
        </div>
    }

    const state = searchParams.state ?? ''
    const codeVerifier = searchParams.code_verifier ?? ''
    const nonce = searchParams.nonce ?? ''
    const code = randomUUID()
    const redirectUrlQuery = new URLSearchParams({ state, code }).toString()
    storeAuth(state + codeVerifier, { clientId: client.clientId, nonce })
    return redirect(searchParams.redirect_uri ?? client.allowRedirectUrls[0] + `?${redirectUrlQuery}`)


}

