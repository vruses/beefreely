# AGENTS.md

Project context for AI agents. Read this first before any development work on this repo.

## Project: beefreely (哔哩免登录)

A Tampermonkey/Violentmonkey userscript that intercepts Bilibili (bilibili.com) API requests to give non-logged-in users a near-logged-in experience — 1080p video, full comments, subtitles, live danmaku, no login popups.

**Runtime**: Browser userscript, executes at `document-start`.
**GitHub**: https://github.com/vruses/beefreely

## Tech Stack

| Category | Tech |
|---|---|
| Language | TypeScript 5.9 (strict) |
| Build | Vite 6 + `vite-plugin-monkey 5` |
| Package manager | pnpm |
| Lint/Format | Biome 2.2 (single quotes, no semicolons, 120 char width) |
| Git hooks | Lefthook (pre-commit: `pnpm lint`) |
| Reactivity | `@vue/reactivity` (loaded via CDN at runtime) |
| Protobuf | `protobufjs` (loaded via CDN at runtime) |
| Hashing | `ts-md5` |
| Versioning | `standard-version` (conventional commits) |

## Build Commands

```bash
pnpm build        # typecheck + build (unminified output → dist/beefreely.user.js)
pnpm build:min    # typecheck + minified build (→ dist/beefreely.min.user.js)
pnpm typecheck    # tsc only
pnpm lint         # biome check
pnpm lint:fix     # biome check --fix
pnpm format       # biome format --write
pnpm dev          # vite dev server
```

## Project Structure

```
src/
├── main.ts                  # Entry point, imports @/core
├── core/
│   ├── index.ts             # Main logic: login detection, subdomain routing, hook injection
│   ├── config.ts            # domainConfig: shared hooks + per-subdomain children + blacklist
│   └── lifecycle.ts         # Document readyState lifecycle manager
├── constants/
│   ├── index.ts             # Re-exports sign.ts (img_key, sub_key)
│   ├── sign.ts              # WBI image/sub key extraction from localStorage
│   └── utils.ts             # toResult() wrapper for Bilibili API response envelope
├── store/
│   └── user.ts              # Reactive isLogin store (watches for real login → clears all hooks)
├── types/
│   ├── response.ts          # ResultType<T> generic
│   └── window.d.ts          # Window type augmentations
├── utils/
│   ├── ajax/
│   │   ├── index.ts         # RequestHooker singleton wrapping ajaxHooker
│   │   └── ajax-hooker.d.ts # Type defs for ajax-hooker library
│   ├── websocket/
│   │   └── intercept.ts     # WebSocket send() monkey-patch for live danmaku
│   ├── wbi-sign.ts          # WBI signature generation (encWbi)
│   └── web-key.ts           # Key extraction from wbi URLs
└── bilibili/                # Per-page/subdomain hook modules
    ├── shared/              # Applied on ALL subdomains
    ├── www/                 # www.bilibili.com
    │   ├── index.ts         # Aggregates history + video hooks
    │   ├── history/         # useHistory — mock history list
    │   └── video/
    ├── search/              # search.bilibili.com — fixes broken search URL
    ├── space/               # space.bilibili.com — mock user profile
    ├── live/                # live.bilibili.com — WebSocket danmaku intercept
    └── t/                   # t.bilibili.com — dynamic pages
```

## Architecture Patterns

### How hooks work
Each "hook" is a `RequestFn` that gets called on every XHR/fetch request. Hooks check if the request URL matches their target endpoint, and if so, modify the request or response.

```typescript
// Hook signature (from src/utils/ajax/index.ts)
type RequestFn<Type = unknown, Payload = unknown, Result = unknown> = (
  request: Ajax.Request<Type, Payload, Result>
) => unknown
```

### How to add a new API hook

1. Create a hook function in the appropriate `bilibili/<subdomain>/` directory
2. The hook function must match the `RequestFn` type
3. Export it from the subdomain's `index.ts` (array of hooks)
4. If it applies to all subdomains, add it to `bilibili/shared/`
5. If the subdomain is new, register it in `src/core/config.ts`

Example — adding a new hook for www:
```typescript
// src/bilibili/www/someFeature/hooks.ts
export const useSomeApi: RequestFn<'xhr'> = (request) => {
  if (!request.url.includes('/x/some/api')) return
  request.response = (res) => {
    // modify response
    res.responseText = JSON.stringify(mockData)
  }
}

// src/bilibili/www/someFeature/index.ts
export default [useSomeApi]

// src/bilibili/www/index.ts — add the import
import someFeature from './someFeature'
export default [...history, ...video, ...someFeature]
```

### Hook patterns in use

- **Modify response** (most common):
  ```typescript
  request.response = (res) => {
    res.responseText = JSON.stringify(mockData)
  }
  ```
- **Modify request URL/params** (e.g. usePlayurl):
  ```typescript
  const query = encWbi(modifiedParams, img_key, sub_key)
  request.url = `//api.bilibili.com/...?${query}`
  ```
- **Strip credentials** (e.g. useReply):
  ```typescript
  request.credentials = 'omit'
  ```
- **Fetch + transform + protobuf** (e.g. useDmView):
  ```typescript
  request.response = async (res) => {
    const message = ProtobufType.decode(new Uint8Array(res.response))
    // modify
    const encoded = ProtobufType.encode(modified).finish()
    res.response = encoded
  }
  ```

### Response format
All API responses use Bilibili's envelope: `{ code, message, ttl, data }`. Use `toResult(data)` from `@/constants/utils` to wrap mock data.

### Login detection flow
1. At `document-start`, check for `DedeUserID__ckMd5` cookie
2. If not logged in → set fake `DedeUserID` cookie on `.bilibili.com`
3. Hooks inject fake login state into nav, player, relation, etc.
4. When real login detected via nav response → `userStore.isLogin` becomes `true` → all hooks cleared + WS intercept stopped

### Code style conventions

- **No semicolons** (Biome enforced)
- **Single quotes** (Biome enforced)
- **No comments unless asked** by the user
- **2-space indent**
- **Use `const`** (never `let` when `const` suffices)
- **Path alias**: `@/` maps to `src/`
- **Hooks end with no default export**; subdomain index files export arrays
- **Lazy imports**: don't import unused modules

## Development workflow

Before coding:
- Search existing hooks in the same directory first
- Reuse existing utilities

Before finishing:
- pnpm typecheck
- pnpm build

## Agent memory

Memory files live in `.claude/memories/`. Each key is a separate `.md` file. Agents read all files in that directory at session start and write back any changed files at session end. The directory is gitignored — do not commit its contents.



### Memory files

```
.claude/memories/
├── wip.md            # Hook or feature currently in progress
└── issues.md         # Known open issues and regressions
```

---

### `wip.md`

Tracks the hook or feature currently being developed. Clear this file when work is complete.

```markdown
# wip

hook: <hookName or null>
file: <target file path or null>
status: <brief description of where work was left off>
next: <what to do next session>
```

---

### `issues.md`

Known open issues and regressions. Remove an entry when the issue is resolved.

```markdown
# issues

## <short title>
- affected hook: <hookName>
- discovered: <ISO date>
- description: <what breaks and under what conditions>
- workaround: <if any>
```

---

### Session start protocol

1. Read all files in `.claude/memories/`
2. If `wip.md` has a non-null hook, resume that work unless the user redirects
3. Surface any entries in `issues.md` before starting new work

### Session end protocol

1. Update `wip.md` — clear if done, update status if still in progress
2. Append to `issues.md` for any newly discovered issues; remove resolved ones
