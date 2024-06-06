import { defineEventHandler } from 'h3';
import Redis from "ioredis";
const redis = new Redis("redis://localhost:6379");

export default defineEventHandler(async (event) => {
    let body = await readBody(event);

    try {
    let res = await redis.get("user/session/" + body.session);

    let valid = false;
    if(res && JSON.parse(res.toString()).verified === true){
        valid = true;
    }
    return new Response(JSON.stringify({ok: valid}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    })
    } catch (e) {
        return new Response(JSON.stringify({ok: false}), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }
})
