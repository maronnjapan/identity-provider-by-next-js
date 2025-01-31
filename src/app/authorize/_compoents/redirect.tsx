'use client';
import { PostAuthorize200, PostAuthorizeBody } from "@/apis";
import { useEffect } from "react";

interface RedirectProps {
    client_id: string;
    response_type: 'code';
    redirect_uri?: string;
    scope?: string;
    state: string;
    nonce?: string;
    code_challenge: string;
    code_challenge_method: "plain" | "S256";
}

export function Redirect({
    client_id,
    response_type,
    redirect_uri,
    scope,
    state,
    nonce,
    code_challenge,
    code_challenge_method,
}: RedirectProps) {

    useEffect(() => {
        const fetchData = async () => {
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

            const { code, redirect_uri: resRedirectUri, state: resState }: PostAuthorize200 = await res.json()

            const redirectUrlQuery = new URLSearchParams({ code, state: resState }).toString()
            if (window !== undefined) {
                window.location.href = resRedirectUri + `?${redirectUrlQuery}`
            }
        }

        fetchData()
    }, [])

    return null;
}