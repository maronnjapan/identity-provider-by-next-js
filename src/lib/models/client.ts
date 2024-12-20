import { randomUUID } from "crypto";
import { generate } from 'generate-password'

export type ClientConstructorType = { clientId?: string, clientSecret?: string, clientName: string, allowRedirectUrls: string[], allowScopes: string[] }

export class Client {
    private readonly _clientId: string;
    private readonly _clientSecret: string;
    private readonly _clientName: string;
    private readonly _allowRedirectUrls: string[];
    private readonly _allowScopes: string[]

    constructor({ allowRedirectUrls, clientName, clientId, clientSecret, allowScopes }: ClientConstructorType) {
        this._clientId = clientId ?? randomUUID()
        this._clientSecret = clientSecret ?? generate({ length: 12 })
        this._clientName = clientName;
        this._allowRedirectUrls = allowRedirectUrls
        this._allowScopes = allowScopes
    }

    static create(value: ClientConstructorType) {
        return new Client(value)
    }

    get clientId() {
        return this._clientId
    }

    get clientSecret() {
        return this._clientSecret
    }

    get clientName() {
        return this._clientName
    }

    get allowRedirectUrls() {
        return this._allowRedirectUrls;
    }

    isAllowUrl(url: string) {
        return !!this.allowRedirectUrls.find(allowUrl => url === allowUrl)
    }
}

