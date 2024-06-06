import { defineEventHandler } from 'h3';
import Redis from "ioredis";
const redis = new Redis("redis://localhost:6379");

export default defineEventHandler(async (event) => {
    try {
        let cursor = '0';
        let keys = [];
        do {
            const res = await redis.scan(cursor, 'MATCH', "sessions/*");
            cursor = res[0];
            keys.push(...res[1]);
        } while (cursor !== '0');
    
        let values = await redis.mget(...keys);
    
        let response = {
            sessions: values
        };
        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (e) {
        let response = {
            sessions: []
        };
        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
    }
})
