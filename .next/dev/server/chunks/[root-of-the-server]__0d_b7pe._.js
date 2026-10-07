module.exports = [
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/app/api/polls/[id]/vote/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
;
;
async function POST(req, { params }) {
    try {
        const { id } = await params;
        const poll = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPoll"])(id);
        if (!poll) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Poll not found'
            }, {
                status: 404
            });
        }
        if (poll.isClosed) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'This poll has been finalized and closed'
            }, {
                status: 400
            });
        }
        const body = await req.json();
        const { optionId, voter, note } = body;
        if (!optionId || !voter || !voter.name) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Option and voter information required'
            }, {
                status: 400
            });
        }
        const voterCleanUsername = (voter.username || voter.name).toLowerCase().trim();
        const voterRecord = {
            username: voterCleanUsername,
            name: voter.name.trim(),
            avatarType: voter.avatarType || 'initials',
            avatarBgColor: voter.avatarBgColor || '#CEFF00',
            votedAt: Date.now(),
            note: note?.trim() || undefined
        };
        // If single-vote mode (not allowMultipleVotes), remove previous vote by this voter
        if (!poll.allowMultipleVotes) {
            for (const opt of poll.options){
                opt.voters = opt.voters.filter((v)=>(v.username || v.name).toLowerCase().trim() !== voterCleanUsername);
            }
        }
        // Add to target option
        const targetOpt = poll.options.find((o)=>o.id === optionId);
        if (!targetOpt) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Option not found'
            }, {
                status: 404
            });
        }
        // Ensure not duplicate in the same option
        const existingIndex = targetOpt.voters.findIndex((v)=>(v.username || v.name).toLowerCase().trim() === voterCleanUsername);
        if (existingIndex >= 0) {
            targetOpt.voters[existingIndex] = voterRecord; // update
        } else {
            targetOpt.voters.push(voterRecord);
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["savePoll"])(poll);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            poll
        });
    } catch (err) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: err.message || 'Failed to submit vote'
        }, {
            status: 500
        });
    }
}
}),
"[project]/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getPoll",
    ()=>getPoll,
    "getRecentPolls",
    ()=>getRecentPolls,
    "getUser",
    ()=>getUser,
    "savePoll",
    ()=>savePoll,
    "saveUser",
    ()=>saveUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$upstash$2f$redis$2f$nodejs$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@upstash/redis/nodejs.mjs [app-route] (ecmascript) <locals>");
;
// In-memory fallback cache
const memoryStore = {
    users: new Map(),
    polls: new Map(),
    pollList: []
};
let redisClient = null;
function getRedis() {
    if (redisClient) return redisClient;
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (url && token) {
        try {
            redisClient = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$upstash$2f$redis$2f$nodejs$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Redis"]({
                url,
                token
            });
            return redisClient;
        } catch (e) {
            console.warn('Failed to initialize Redis client, using in-memory store:', e);
        }
    }
    return null;
}
async function saveUser(user, passwordHash) {
    const redis = getRedis();
    const cleanUsername = user.username.toLowerCase().trim();
    const payload = {
        user: {
            ...user,
            username: cleanUsername
        },
        passwordHash
    };
    memoryStore.users.set(cleanUsername, payload);
    if (redis) {
        try {
            await redis.set(`votepop:user:${cleanUsername}`, JSON.stringify(payload));
        } catch (e) {
            console.warn('Redis error in saveUser, cached in memory:', e);
        }
    }
}
async function getUser(username) {
    const cleanUsername = username.toLowerCase().trim();
    const redis = getRedis();
    if (redis) {
        try {
            const data = await redis.get(`votepop:user:${cleanUsername}`);
            if (data) {
                const parsed = typeof data === 'string' ? JSON.parse(data) : data;
                memoryStore.users.set(cleanUsername, parsed);
                return parsed;
            }
        } catch (e) {
            console.warn('Redis error in getUser, reading memory:', e);
        }
    }
    return memoryStore.users.get(cleanUsername) || null;
}
async function savePoll(poll) {
    const redis = getRedis();
    memoryStore.polls.set(poll.id, poll);
    if (!memoryStore.pollList.includes(poll.id)) {
        memoryStore.pollList.unshift(poll.id);
    }
    if (redis) {
        try {
            await redis.set(`votepop:poll:${poll.id}`, JSON.stringify(poll));
            await redis.lpush('votepop:recent_polls', poll.id);
            await redis.ltrim('votepop:recent_polls', 0, 49);
        } catch (e) {
            console.warn('Redis error in savePoll, cached in memory:', e);
        }
    }
}
async function getPoll(id) {
    const redis = getRedis();
    if (redis) {
        try {
            const data = await redis.get(`votepop:poll:${id}`);
            if (data) {
                const parsed = typeof data === 'string' ? JSON.parse(data) : data;
                memoryStore.polls.set(id, parsed);
                return parsed;
            }
        } catch (e) {
            console.warn('Redis error in getPoll, checking memory:', e);
        }
    }
    return memoryStore.polls.get(id) || null;
}
async function getRecentPolls() {
    const redis = getRedis();
    if (redis) {
        try {
            const ids = await redis.lrange('votepop:recent_polls', 0, 19);
            if (ids && ids.length > 0) {
                const uniqueIds = Array.from(new Set(ids));
                const polls = [];
                for (const id of uniqueIds){
                    const poll = await getPoll(id);
                    if (poll) polls.push(poll);
                }
                return polls;
            }
        } catch (e) {
            console.warn('Redis error in getRecentPolls, reading memory:', e);
        }
    }
    return Array.from(memoryStore.polls.values()).sort((a, b)=>b.createdAt - a.createdAt);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0d_b7pe._.js.map