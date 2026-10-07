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
"[project]/app/api/polls/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
;
;
const POP_PALETTE = [
    '#CEFF00',
    '#FFE600',
    '#00E5FF',
    '#FF6EA7',
    '#FF5533',
    '#A78BFA'
];
async function GET() {
    try {
        const polls = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRecentPolls"])();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            polls
        });
    } catch (err) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: err.message || 'Failed to fetch polls'
        }, {
            status: 500
        });
    }
}
async function POST(req) {
    try {
        const body = await req.json();
        const { title, notes, category, options, allowCustomOptions = true, allowMultipleVotes = false, createdBy } = body;
        if (!title || !title.trim()) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Poll statement/question is required'
            }, {
                status: 400
            });
        }
        if (!options || !Array.isArray(options) || options.filter((o)=>o.trim()).length < 2) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'At least 2 options are required'
            }, {
                status: 400
            });
        }
        const cleanOptions = options.map((opt)=>opt.trim()).filter((opt)=>opt.length > 0);
        const pollId = 'p-' + Math.random().toString(36).substring(2, 8);
        const pollOptions = cleanOptions.map((text, idx)=>({
                id: `opt-${idx + 1}-${Math.random().toString(36).substring(2, 6)}`,
                text,
                color: POP_PALETTE[idx % POP_PALETTE.length],
                voters: []
            }));
        const newPoll = {
            id: pollId,
            title: title.trim(),
            notes: notes?.trim() || undefined,
            category: category?.trim() || 'General',
            createdAt: Date.now(),
            createdBy: createdBy || {
                username: 'anonymous',
                name: 'Friend',
                avatarType: 'initials',
                avatarBgColor: '#CEFF00'
            },
            allowCustomOptions: !!allowCustomOptions,
            allowMultipleVotes: !!allowMultipleVotes,
            isClosed: false,
            options: pollOptions
        };
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["savePoll"])(newPoll);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            poll: newPoll
        });
    } catch (err) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: err.message || 'Failed to create poll'
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

//# sourceMappingURL=%5Broot-of-the-server%5D__1t8a7pz._.js.map