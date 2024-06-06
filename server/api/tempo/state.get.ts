import { defineEventHandler, readBody } from 'h3'
import Redis from "ioredis";
const redis = new Redis("redis://localhost:6379");

export default defineEventHandler(async (event) => {
    try {
        let query = getQuery(event);

        let userRes = await redis.get("user/session/" + query.usersession);

        let username = "";
        if(userRes){
            username = JSON.parse(userRes.toString()).username;
        }else{
            return new Response(JSON.stringify({ error: "User Session invalid" }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        let stateRes = await redis.get("states/" + query.session + "/" + username);
        return new Response(JSON.stringify({ state: stateRes ? stateRes : 0 }), {
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