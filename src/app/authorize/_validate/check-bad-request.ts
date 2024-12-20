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
    code_verifier?: string;
}

const requiredQueryNames: Permutation<keyof RequiredAuthorizeQuery> = ['client_id', 'response_type', 'state']

export const isBadRequestQuery = (query: RequiredAuthorizeQuery & OptionalAuthorizeQuery) => {
    const isExistRequiredQueries = requiredQueryNames.every(name => !!query[name]);
    if (!isExistRequiredQueries) {
        return true;
    }
    if (query.response_type !== 'code') {
        return true;
    }

    const client = getClientById(query.client_id)
    if (!client) {
        return true;
    }

    if (query.redirect_uri && !client.isAllowUrl(query.redirect_uri)) {
        return true;
    }

    return false
}