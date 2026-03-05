![CI](https://github.com/mass22/themeethub/workflows/CI/badge.svg)

# TheMeetHub

> **The open-source platform to organize, manage, and grow your community meetups from one central hub.**  
> Plateforme open source pour organiser, gérer et développer vos meetups communautaires.

**Default branch:** `master`

---

## ✨ Features

- 🗓 **Event Management** — Create, update, and publish your meetups with ease (Luma, Zoom, replays).
- 🎤 **Speaker Management** — Accept proposals, store bios, and showcase profiles.
- 📣 **Content & Media** — Promo items, social posts, YouTube replays, visuals archive.
- 📋 **Logistics** — Tasks, items, and owners linked to events.
- 👥 **Community Tools** — Contacts, sponsors, venues, contractors, tools.
- 🌐 **External Communities** — Track other communities, their events, and your participations.
- 📊 **Admin Dashboard** — Stats globales, insights (promo en retard, logistique en attente), tendances de conversion, accès rapide à tous les modules.
- 🧩 **Data Source** — JSON mocks (default, no DB) or Prisma + SQLite / PostgreSQL.
- ⚡ **Built with Nuxt 4 & Nitro** — Modern, fast, and fully extensible.
- 🧠 **MCP Architecture** — Model Context Providers for clean, modular code.

---

## 🛠 Tech Stack

- **[Nuxt 4](https://nuxt.com/)** — Vue 3 framework with SSR & hybrid rendering
- **[Nitro](https://nitro.unjs.io/)** — Lightweight server engine, backend-agnostic
- **[Prisma](https://www.prisma.io/)** — ORM with SQLite (dev) or PostgreSQL (prod)
- **Tailwind CSS** — Utility-first styling
- **MCP (Model Context Providers)** — Modular server-side logic
- **Data sources** — JSON mocks (no DB) or Prisma + SQLite/PostgreSQL

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

### 3. Configure environment

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

**Data source:**  
- `NUXT_USE_MOCKS=true` (default) — uses JSON files in `mocks/`, no database required.  
- `NUXT_USE_MOCKS=false` — uses Prisma with `DATABASE_URL` (SQLite or PostgreSQL).

**With Prisma (SQLite):** set `NUXT_USE_MOCKS=false` and run:

```bash
npm run db:push
```

Optional: `npm run db:studio` to open Prisma Studio.

### 4. Run the dev server

```bash
npm run dev
```

Your app will be running at [http://localhost:3000](http://localhost:3000) 🚀

---

## 📂 Project Structure

```

themeethub/
├── app/
│   ├── app.vue
│   ├── error.vue
│   ├── app.config.ts
│   ├── assets/          # Styles, images
│   ├── components/      # UI components
│   ├── composables/     # Composables
│   ├── layouts/         # Layouts
│   ├── middleware/      # Route middlewares
│   ├── pages/           # Routing
│   ├── plugins/         # Nuxt Plugins
│   └── utils/           # Helpers
├── mocks/                # JSON mock data (when NUXT_USE_MOCKS=true)
│   ├── events.json
│   ├── speakers.json
│   ├── sponsors.json
│   ├── contacts.json
│   ├── promo_items.json
│   ├── logistics_items.json
│   ├── social_posts.json
│   ├── external_communities.json
│   ├── external_events.json
│   ├── participations.json
│   └── ...
├── prisma/
│   ├── schema.prisma    # Models: Event, Speaker, Sponsor, Contact, Venue, etc.
│   └── migrations/
├── public/               # Static files
├── server/               # Nitro (backend)
│   ├── api/              # API routes
│   ├── middleware/      # Middlewares serveur
│   ├── model/           # MCP
│   ├── providers/       # Backends
│   └── utils/           # DataSource (mock + Prisma)
├── shared/               # Shared code
│   ├── types/           # Typescript types/interfaces
│   └── utils/           # Common Helpers
├── nuxt.config.ts
├── package.json
├── tsconfig.json
├── .env.example
└── README.md

```

---

## 🧑‍💻 Contributing

We welcome contributions from developers of all skill levels.

1. Fork the repository
2. Create a new branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to your fork: `git push origin feature/my-feature`
5. Open a Pull Request 🚀

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for guidelines.

---

## 📅 Roadmap (MVP)

- [x] Event CRUD
- [x] Speaker / sponsor proposals (Request)
- [x] Prisma + SQLite + JSON mocks
- [x] Contacts, sponsors, venues, contractors, tools
- [x] Promo items, logistics, social posts
- [x] External communities & participations
- [x] Admin dashboard
- [ ] Public event page with Luma/YouTube integration
- [ ] Authentication (magic link)
- [ ] Deployment template (Vercel/Netlify)

---

## 📜 License

This project is licensed under the [MIT License](./LICENSE).  
Feel free to use, modify, and share — with attribution.

---

## 💬 About

**TheMeetHub** was originally built to manage [Vue Montréal](https://www.vuemtl.com) meetups,  
but is designed to work for any tech or community group around the world.
