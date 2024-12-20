import { Client } from "../models/client";

const clients = [
    new Client({ allowRedirectUrls: ['http://localhost:3000'], clientName: 'client1', clientId: 'd654d2fc-118b-8592-020a-f5b13c4eafbe', allowScopes: [] })
]

export const getClientById = (clientId: string) => clients.find(client => client.clientId === clientId)