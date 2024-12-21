import { getClientById } from "@/lib/services/client.service";
import { Permutation } from "@/utils/util-type";

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
    code_challenge?: string;
    code_challenge_method?: 'S256' | 'plain';
}

const requiredQueryNames: Permutation<keyof RequiredAuthorizeQuery> = ['client_id', 'response_type', 'state']

export const isBadRequestQuery = (query: RequiredAuthorizeQuery & OptionalAuthorizeQuery) => {
    console.log(query)
    const isExistRequiredQueries = requiredQueryNames.every(name => !!query[name]);
    console.log(isExistRequiredQueries)
    if (!isExistRequiredQueries) {
        return true;
    }
    if (query.response_type !== 'code') {
        return true;
    }

    console.log(query.client_id)
    const client = getClientById(query.client_id)
    if (!client) {
        return true;
    }

    console.log(query.redirect_uri)
    console.log(query.redirect_uri && !client.isAllowUrl(query.redirect_uri))
    if (query.redirect_uri && !client.isAllowUrl(query.redirect_uri)) {
        return true;
    }


    return false
}