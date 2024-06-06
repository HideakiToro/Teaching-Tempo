import { defineEventHandler, readBody } from 'h3'
import Redis from "ioredis";
const redis = new Redis("redis://localhost:6379");

export default defineEventHandler(async (event) => {
    try {
        let body = await readBody(event);
        let res = await redis.get("user/session/" + body.userSession);

        let username = "";
        if (res) {
            username = JSON.parse(res.toString()).username;
        } else {
            return new Response(JSON.stringify({ error: "User Session invalid" }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        await redis.set("states/" + body.session + "/" + username, body.set, "EX", 600);

        return new Response(JSON.stringify({ message: "Change set" }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (e) {
        return new Response(JSON.stringify({ error: e }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }
})