import { defineEventHandler, readBody } from 'h3'
import { User } from './login.post';
import fs from 'node:fs';

const defaultDir = "content/login/";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    if (body.name && body.password) {
        let users = JSON.parse(fs.readFileSync(defaultDir + "users.json").toString())
        let result: User | undefined = users.find(user => user.name === body.username);
        if (result == undefined) {
            try {
                users.push({
                    name: body.name,
                    pass: body.password
                })
                fs.writeFileSync(defaultDir + "users.json", JSON.stringify(users));
                return new Response(JSON.stringify({ message: "User created" }), {
                    status: 201,
                    headers: { 'Content-Type': 'application/json' }
                })
            } catch(e) {
                return new Response(JSON.stringify({ message: "Something went wrong while creating User", error: e }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                })
            }
        } else {
            return new Response(JSON.stringify({ message: "Username already in use" }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            })
        }
    } else {
        return new Response(JSON.stringify({ message: "Missing fields", body: body }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
        })
    }
})