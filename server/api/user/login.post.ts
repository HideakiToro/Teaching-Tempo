import { defineEventHandler, readBody } from 'h3'
import fs from 'node:fs';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import Redis from "ioredis";
const defaultDir = "content/login/";
const redis = new Redis("redis://localhost:6379");

export interface User {
    name: string;
    pass: string;
}

export default defineEventHandler(async (event) => {
    let body = await readBody(event)
    let redisRes = await redis.get("user/session/" + body.session);

    if (redisRes) {
        let content = JSON.parse(redisRes);

        let users = JSON.parse(fs.readFileSync(defaultDir + "users.json").toString())
        let result: User | undefined = users.find(user => user.name === body.username);

        if(result){
            let password = AES.decrypt(body.pass, content.key);

            if(result.pass === password.toString(Utf8)){
                let response = { session: content.session, key: content.key, verified: true, username: body.username };
                await redis.set("user/session/" + content.session, JSON.stringify(response), "EX", 600);
                return new Response(JSON.stringify({ message: "Session Validated with User" }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                })
            }else{
                return new Response(JSON.stringify({ error: "Login invalid" }), {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                })
            }
        }else{
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
            })
        }
    } else {
        return new Response(JSON.stringify({ error: "SessionID not found" }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
        })
    }
})
