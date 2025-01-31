
export type RequiredAuthorizeQuery = {
    client_id: string;
    response_type: 'code';
    state: string
}

export type OptionalAuthorizeQuery = {
    scope?: string;
    audience?: string;
    redirect_uri?: string;
    nonce?: string;
    code_challenge: string;
    code_challenge_method: 'S256' | 'plain';
}