import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
})

export const db = {
    upsert: async <T>({ id, data }: { id: string, data: T }) => {
        await redis.set(id, JSON.stringify(data))
    }
    ,
    getById: async <T>(id: string): Promise<T | null> => {
        return await redis.get<T | null>(id)
    },
    delete: async (id: string) => {
        return await redis.del(id)
    }
}