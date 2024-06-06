import { defineEventHandler, readBody } from 'h3'
import Redis from "ioredis";
const redis = new Redis("redis://localhost:6379");

export default defineEventHandler(async (event) => {
    try {
        let query = getQuery(event);
        let cursor = '0';
        let keys = [];
        do {
            const res = await redis.scan(cursor, 'MATCH', "states/" + query.session + "/*");
            if (res) {
                cursor = res[0];
                keys.push(...res[1]);
            } else {
                break;
            }
        } while (cursor !== '0');

        if (keys.length > 0) {
            let values = await redis.mget(...keys);

            let sum = 0;
            let pos = 0;
            let neg = 0;
            let ok = 0;
            values.forEach(val => {
                if (val) {
                    sum += parseInt(val) / values.length;
                    switch(parseInt(val)){
                        case -1:
                            neg++
                            break;
                        case 0:
                            ok++;
                            break;
                        case 1:
                            pos++;
                            break;
                    }
                }
            });

            return new Response(JSON.stringify({ total: sum, count: values.length, negative: neg, ok: ok, positive: pos }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            return new Response(JSON.stringify({ total: 0 }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (e) {
        return new Response(JSON.stringify({ error: e }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
})