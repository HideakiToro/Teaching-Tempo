import { defineEventHandler } from 'h3';
import Redis from "ioredis";
const redis = new Redis("redis://localhost:6379");

export default defineEventHandler(async (event) => {
    let query = getQuery(event);
    try {
        let res = await redis.get("sessions/" + query.session);

        if(res){
            let session = JSON.parse(res);

            return new Response(JSON.stringify(session), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            })
        }else {
            return new Response(JSON.stringify({error: "Session not found"}), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            })
        }
    } catch(e) {
        return new Response(JSON.stringify({error: e}), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }
})
