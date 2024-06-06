import { defineEventHandler, readBody } from 'h3';
import { User } from './login.post';
import fs from 'node:fs';
import Redis from 'ioredis';

const defaultDir = "content/login/";
const redis = new Redis("redis://localhost:6379");

export default defineEventHandler(async (event) => {
    let body = await getQuery(event);
    if(body.session){
        let res = await redis.get("user/session/" + body.session);
        if(!res){
            return new Response(JSON.stringify({message: "Session not found"}), {
                status: 404,
                headers: { 'Content-Type': 'application/json'}
            })
        }
        let username = "";
        username = JSON.parse(res.toString()).username;
        let users = JSON.parse(fs.readFileSync(defaultDir + "users.json").toString())
        let result: User | undefined = users.find(user => user.name === username);
        if (result) {
            return new Response(JSON.stringify({message: "User Found", name: result.name}),{
                status: 200,
                headers: {'Content-Type': 'application/json'}
            });
        } else {
            return new Response(JSON.stringify({ message: "User not found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            })
        }
    }else{
        return new Response(JSON.stringify({message: "missing session field"}),{
            status: 403,
            headers: { 'Content-Type': 'application/json' }
        });
    }
})