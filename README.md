![CI](https://github.com/mass22/themeethub/workflows/CI/badge.svg)

# TheMeetHub

> **The open-source platform to organize, manage, and grow your community meetups from one central hub.**

**Default branch:** `master`

---

## ✨ Features

- 🗓 **Event Management** — Create, update, and publish meetups (Luma, Zoom, replays). Event descriptions use a **rich text editor** (Nuxt UI `UEditor`, **Markdown** stored in the API).
- 📅 **Calendar** — FullCalendar-based views for events.
- 🎤 **Speaker Management** — Proposals, bios, profiles.
- 📣 **Content & Media** — Promo items, social posts, YouTube replays, visuals.
- 📋 **Logistics** — Tasks and items linked to events.
- 👥 **Community Tools** — Contacts, sponsors, venues, contractors, tools.
- 🌐 **External Communities** — Other communities, their events, participations.
- 📊 **Admin Dashboard** — Stats, overdue promo, pending logistics, conversion trends.
- 🌍 **i18n** — French (default) and English (`@nuxtjs/i18n`, prefix strategy except default locale).
- 🧩 **Data Source** — JSON mocks (default, no DB) or Prisma + SQLite / PostgreSQL.
- ⚡ **Nuxt 4 + Nitro + Vite 8** — Client-side app (`ssr: false`); API on Nitro.

---

## 🛠 Tech Stack

| Layer | Stack |
|--------|--------|
| Framework | [Nuxt 4.4](https://nuxt.com/), Vue 3.5, [Vite 8](https://vite.dev/) (pinned via `package.json` + `overrides`) |
| UI | [Nuxt UI 4](https://ui.nuxt.com/), Tailwind CSS 4 |
| State | [Pinia](https://pinia.vuejs.org/) (`app/store/`) |
| Server | [Nitro](https://nitro.unjs.io/) — `server/api/*`, `server/utils/*` |
| Data | [Prisma 5](https://www.prisma.io/) — SQLite or PostgreSQL; optional JSON mocks |
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
- [ ] Dedicated **public** marketing event page (optional split from hub)
- [ ] Authentication (magic link)
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
