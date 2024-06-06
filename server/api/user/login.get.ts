import { defineEventHandler } from 'h3';
import { v4 as uuidv4 } from 'uuid';
import Redis from "ioredis";
const redis = new Redis("redis://localhost:6379");

export default defineEventHandler(async (event) => {
    let sessionString = uuidv4();
    let encryptionKey = uuidv4();

    let response = { session: sessionString, key: encryptionKey, verified: false, user: "" };

    try {
        await redis.set("user/session/" + sessionString, JSON.stringify(response), "EX", 180);

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
    } catch(e) {
        return new Response(JSON.stringify({error: e}), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }
})
