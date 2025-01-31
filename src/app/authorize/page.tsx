import { OptionalAuthorizeQuery, RequiredAuthorizeQuery } from "./_validate/check-bad-request";
import { redirect } from "next/navigation";

import { PostAuthorize200, PostAuthorizeBody } from "@/apis";
import { Redirect } from "./_compoents/redirect";




export default async function Page({ searchParams }: { searchParams: Promise<RequiredAuthorizeQuery & OptionalAuthorizeQuery> }) {
    const { client_id, response_type, redirect_uri, scope, state, nonce, code_challenge, code_challenge_method, audience } = await searchParams

    const body: PostAuthorizeBody = { client_id, response_type, redirect_uri, scope: scope ?? '', state, nonce, code_challenge, code_challenge_method, grant_type: 'authorization_code' }
    const res = await fetch('https://localhost:3002/api/authorize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        cache: 'no-store',
        body: JSON.stringify(body),
    })
    if (res.status !== 200) {
        return <div>error</div>
    }

    console.log(res)

    // const { code, redirect_uri: resRedirectUri, state: resState }: PostAuthorize200 = await res.json()

    // const redirectUrlQuery = new URLSearchParams({ code, state: resState }).toString()

    // return <Redirect client_id={client_id} response_type={response_type} redirect_uri={redirect_uri} scope={scope} state={state} nonce={nonce} code_challenge={code_challenge} code_challenge_method={code_challenge_method} />

    // return redirect(resRedirectUri + `?${redirectUrlQuery}`)

}

// http://localhost:3002/authorize?client_id=d654d2fc-118b-8592-020a-f5b13c4eafbe&scope=openid+profile+email&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code&response_mode=query&state=a0lXRkg2Y0VVTTI4WmxON01rMUUtMkgzUTNJRDJSN0k2Ukpady5seXNtOA%3D%3D&nonce=aGRpWWxSVW9tLkFtUkd0M09Gai5PM3JYWFVsa0d1N25tcUlpLmpsbElGRg%3D%3D&code_challenge=fdVdFVAqFW73Og2UvTQFtigm0j3ZykGCWKpnAmEK67U&code_challenge_method=S256

// http://localhost:3000/authorize?client_id=d654d2fc-118b-8592-020a-f5b13c4eafbe&scope=openid+profile+email&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code&response_mode=query&state=a0lXRkg2Y0VVTTI4WmxON01rMUUtMkgzUTNJRDJSN0k2Ukpady5seXNtOA%3D%3D&nonce=aGRpWWxSVW9tLkFtUkd0M09Gai5PM3JYWFVsa0d1N25tcUlpLmpsbElGRg%3D%3D&code_challenge=fdVdFVAqFW73Og2UvTQFtigm0j3ZykGCWKpnAmEK67U&code_challenge_method=S256