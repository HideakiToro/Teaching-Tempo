import { defineEventHandler, readBody } from 'h3';
import { User } from './login.post';
import fs from 'node:fs';
import Redis from 'ioredis';

const defaultDir = "content/login/";
const redis = new Redis("redis://localhost:6379");

export default defineEventHandler(async (event) => {
    let body = await readBody(event);
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
            try {
                users.splice(users.indexOf(result), 1);
                fs.writeFileSync(defaultDir + "users.json", JSON.stringify(users));
                return new Response(JSON.stringify({ message: "User deleted" }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                })
            } catch(e) {
                return new Response(JSON.stringify({ message: "Something went wrong while creating User", error: e }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
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