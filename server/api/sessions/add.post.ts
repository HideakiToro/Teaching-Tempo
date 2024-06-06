import { defineEventHandler } from 'h3';
import { v4 as uuidv4 } from 'uuid';
import Redis from "ioredis";
const redis = new Redis("redis://localhost:6379");

export default defineEventHandler(async (event) => {
    let eventBody = await readBody(event);

    let checkBody = JSON.stringify({
        session: eventBody.session
    });

    let check = await (await fetch("http://localhost:3000/api/user/check", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: checkBody
    })).json();

    if(!check.ok){
        return new Response(JSON.stringify({error: check}), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
        })
    }

    let sessionString = uuidv4();

    let response = { session: sessionString, name: eventBody.name };

    try {
        await redis.set("sessions/" + sessionString, JSON.stringify(response));
        
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
