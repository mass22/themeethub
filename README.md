![CI](https://github.com/mass22/themeethub/workflows/CI/badge.svg)

# TheMeetHub

> **The open-source platform to organize, manage, and grow your community meetups from one central hub.**

**Default branch:** `master`

---

## ✨ Features

### Meetup & community operations

- 🗓 **Event management** — Create, update, and publish meetups (optional Luma id, Zoom, replay URLs). Descriptions use **Nuxt UI `UEditor`** with **Markdown** persisted via the API.
- 🎬 **Event videos** — Multiple replays per event (`title` + YouTube URL).
- 📅 **Calendar** — FullCalendar-based views for events.
- 🎤 **Speakers** — Directory, bios, public listing; overlap checks on name + role when creating.
- 📣 **Content & media** — Promo items, social posts, replays, visuals (`@nuxt/image`).
- 📋 **Logistics** — Items and tasks scoped to events.
- 👥 **Community data** — Contacts, sponsors (including `financial_event`), venues, contractors, tools.
- 🌐 **External communities** — Other groups, their events, participations.
- 📊 **Admin dashboard** — Aggregated stats, overdue promo, pending logistics, trends.
- 📝 **Inbound requests** — Sponsor / speaker request forms (public POST endpoints with validation).

### Platform & DX

- 🌍 **i18n** — French (default) and English (`@nuxtjs/i18n`, `prefix_except_default`).
- 🧩 **Data source** — `mocks/*.json` when `NUXT_USE_MOCKS=true` (default, no DB), or **Prisma** with SQLite or PostgreSQL when `NUXT_USE_MOCKS=false`.
- ⚡ **Nuxt 4 + Nitro + Vite 8** — **SPA** (`ssr: false`); REST-style handlers under `server/api/*`.

### Authentication & access (what this repo actually does)

- 🔐 **Better Auth** — Magic-link sign-in (email via Resend when configured; otherwise link logged in dev). Optional **GitHub OAuth** when env + `NUXT_PUBLIC_GITHUB_AUTH` are set.
- 🍪 **Session-based hub access** — Back-office routes and `/api/*` (except `/api/auth/*` and `/api/public/*`) require a valid session. This is **not** a separate “JWT API product” layer; it follows Better Auth’s session model.
- ✉️ **Optional allowlist** — `NUXT_AUTH_ALLOWED_EMAILS` restricts which signed-in users may use the hub. This is **not** a full RBAC matrix (no admin / editor / viewer roles in the schema).
- 🏢 **Single-tenant by design** — One deployment, one shared dataset for allowed users. There is **no** built-in multi-tenant org model, row-level tenant isolation, or per-customer data silos.
- 🧪 **Dev with mocks** — With mocks + dev defaults, API auth can be relaxed so the SPA works without logging in (`NUXT_MOCK_DEV_API_BYPASS`; see `.env.example`). Use `false` when you want to test the real login flow against JSON data.

---

## 🛠 Tech Stack

| Layer | Stack |
|--------|--------|
| Framework | [Nuxt 4.4](https://nuxt.com/), Vue 3.5, [Vite 8](https://vite.dev/) (pinned via `package.json` + `overrides`) |
| UI | [Nuxt UI 4](https://ui.nuxt.com/), Tailwind CSS 4 |
| State | [Pinia](https://pinia.vuejs.org/) (`app/store/`) |
| Server | [Nitro](https://nitro.unjs.io/) — `server/api/*`, `server/utils/*` |
| Data | [Prisma 5](https://www.prisma.io/) — SQLite or PostgreSQL; optional JSON mocks |
| Auth | [Better Auth](https://www.better-auth.com/) — magic link, optional GitHub OAuth, cookie sessions; optional `NUXT_AUTH_ALLOWED_EMAILS` |
| Validation | Zod 4 |
| Content / media | `@nuxt/content`, `@nuxt/image` |
| Tests | Vitest, Playwright (E2E with `nuxt.config.e2e.ts`) |

**Aliases (important for contributors):** `srcDir` is `app/`. Shared TypeScript types live in **`types/`** at the **repository root** (import as `~~/types/...`). The `~/…` alias points at the `app/` directory per Nuxt 4 defaults.

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/mass22/themeethub.git
cd themeethub
```

### 2. Install dependencies

```bash
npm install
```

`postinstall` runs `nuxt prepare`, a small **Vite / plugin-vue patch** (`patch-vue-plugin.js`) for Node crypto compatibility, and `prisma generate`.

### 3. Configure environment

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

**Data source:**

- `NUXT_USE_MOCKS=true` (default) — JSON files under `mocks/`, no database.
- `NUXT_USE_MOCKS=false` — Prisma with `DATABASE_URL` (SQLite or PostgreSQL).

**Auth while using mocks (local dev):** by default the dev app can skip the login wall for the SPA and relax `/api/*` auth when mocks are on. Set `NUXT_MOCK_DEV_API_BYPASS=false` in `.env` to force real sessions against mock JSON (see `.env.example`).

**With Prisma (SQLite):** set `NUXT_USE_MOCKS=false`, then:

```bash
npm run db:push
```

**With PostgreSQL:** use `npm run db:migrate` (or `db:push`) after setting `DATABASE_URL`.

Optional: `npm run db:studio` for Prisma Studio.

### 4. Run the dev server

```bash
npm run dev
```

If file watchers hit OS limits on macOS, try:

```bash
npm run dev:safe
```

App: [http://localhost:3000](http://localhost:3000)

---

## 🆕 Recent Changes (March 2026)

- **Better Auth** for the back office: magic link, optional `NUXT_AUTH_ALLOWED_EMAILS`, optional GitHub OAuth (`NUXT_PUBLIC_GITHUB_AUTH` + GitHub app credentials), catch-all at `server/api/auth/[...].ts`.
- **Data mode resolution** — `NUXT_USE_MOCKS` overrides `runtimeConfig.useMocks`; shared helper `server/utils/resolveUseMocks.ts`.
- **Dev + mocks** — Optional API auth bypass when mocks are active (`NUXT_MOCK_DEV_API_BYPASS`); SPA hint via `server/api/public/dev-session-hint.get.ts` so contributors can work without logging in unless disabled.
- Event model/API support a **`videos`** list (`title` + `youtube_url`).
- Sponsor typing includes **`financial_event`**.
- Public read endpoints for events, speakers, and sponsors for listing pages.
- **CI / E2E** — Node 24, Playwright, `nuxt.config.e2e.ts` with `e2eBypassAuth` for automated runs.

---

## 📂 Project Structure

```
themeethub/
├── app/                      # Nuxt srcDir
│   ├── app.vue
│   ├── error.vue
│   ├── app.config.ts
│   ├── assets/               # CSS, etc.
│   ├── components/           # Vue components (e.g. event/EventDescriptionEditor.vue)
│   ├── composables/
│   ├── layouts/
│   ├── middleware/
│   ├── pages/                # File-based routes
│   ├── plugins/
│   └── store/                # Pinia stores
├── types/                    # Shared TS types (root — use ~~/types/… in app code)
├── mocks/                    # JSON mocks when NUXT_USE_MOCKS=true
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
├── server/
│   ├── api/                  # REST-style handlers
│   ├── utils/                # dataSource, prisma, helpers
│   └── services/             # e.g. email
├── nuxt.config.ts
├── nuxt.config.e2e.ts        # Playwright dev server config
├── patch-vue-plugin.js       # postinstall patch
├── package.json
├── .env.example
└── README.md
```

---

## 🧪 Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` / `dev:safe` | Development server |
| `npm run build` / `preview` | Production build & preview |
| `npm run lint` | ESLint |
| `npm test` | Vitest runner (see `package.json` for `test:*` variants) |
| `npm run test:e2e` | Playwright |

---

## 🧑‍💻 Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m 'Add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

See [`CONTRIBUTING.md`](./CONTRIBUTING.md).

---

## 📅 Roadmap (MVP)

- [x] Event CRUD
- [x] Speaker / sponsor proposals (Request)
- [x] Prisma + SQLite + JSON mocks
- [x] Contacts, sponsors, venues, contractors, tools
- [x] Promo items, logistics, social posts
- [x] External communities & participations
- [x] Admin dashboard
- [x] Event detail / hub page (editing, Zoom, replay fields — scope is internal hub, not a separate marketing site)
- [x] Authentication (magic link, Better Auth)
- [ ] Dedicated **public** marketing event page (optional split from hub)
- [ ] Deployment template (Vercel/Netlify)

---

## Comparatif — ancien README vs dépôt actuel

| Sujet | Ancien README | État actuel du dépôt |
|--------|----------------|----------------------|
| **MCP / « Model Context Providers »** | Mentionné comme architecture | **Absent du code** — pas de dossier `server/model/` ni de MCP serveur. Données via **API Nitro** + **Pinia**. |
| **Dossier `shared/`** | `shared/types`, `shared/utils` | **N’existe pas** — types dans **`types/`** à la racine. |
| **SSR** | « SSR & hybrid rendering » | **`ssr: false`** dans `nuxt.config.ts` — **SPA côté client** ; Nitro sert l’API et le build. |
| **Structure `app/`** | Générique | **`srcDir: 'app'`** — pages, composants, stores sous `app/`. |
| **Versions** | « Nuxt 4 » sans précision | **Nuxt ~4.4**, **Vite 8**, **Vue ~3.5**, **@nuxt/ui ~4.4**, etc. (voir `package.json`). |
| **i18n, Calendar, Editor** | Non décrits | **@nuxtjs/i18n** (FR/EN), **FullCalendar**, **UEditor** pour la description d’événement (Markdown). |
| **Multi-tenant / JWT / RBAC** | Parfois annoncé sur des landings génériques | **Non** — hub **mono-locataire**, **sessions** Better Auth, **allowlist d’e-mails** optionnelle (pas de rôles utilisateur dans Prisma). |
| **Postinstall** | Non mentionné | **`patch-vue-plugin.js`** + `prisma generate`. |
| **E2E** | Non mentionné | **Playwright** + **`nuxt.config.e2e.ts`**. |

*Si une ligne du tableau est encore floue (ex. stratégie de déploiement exacte), se référer au code et à `.env.example`.*

---

## 📜 License

[MIT License](./LICENSE).

---

## 💬 About

**TheMeetHub** was originally built to manage [Vue Montréal](https://www.vuemtl.com) meetups,  
but is designed to work for any tech or community group around the world.
