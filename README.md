![CI](https://github.com/mass22/themeethub/workflows/CI/badge.svg)

# TheMeetHub

> **The open-source platform to organize, manage, and grow your community meetups from one central hub.**  
> Plateforme open source pour organiser, gérer et développer vos meetups communautaires.

**Default branch:** `master`

---

## ✨ Features

- 🗓 **Event Management** — Create, update, and publish your meetups with ease.
- 🎤 **Speaker Management** — Accept proposals, store bios, and showcase profiles.
- 📣 **Content & Media** — Link YouTube replays, upload visuals, and keep an archive.
- 👥 **Community Tools** — Manage members, contacts, and collaborations.
- 📊 **Dashboard** — Centralized view of upcoming events, stats, and tasks.
- 🧩 **Backend-Agnostic** — Works with Supabase, Firebase, Prisma, or any custom API.
- ⚡ **Built with Nuxt 4 & Nitro** — Modern, fast, and fully extensible.
- 🧠 **MCP Architecture** — Model Context Providers for clean, modular code.

---

## 🛠 Tech Stack

- **[Nuxt 4](https://nuxt.com/)** — Vue 3 framework with SSR & hybrid rendering
- **[Nitro](https://nitro.unjs.io/)** — Lightweight server engine, backend-agnostic
- **Tailwind CSS** — Utility-first styling
- **MCP (Model Context Providers)** — Modular server-side logic
- **Optional providers** — Supabase, Firebase, REST, or in-memory mock

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

Copy `.env.example` to `.env` and update values (API keys, DB connection, etc.):  

```bash
cp .env.example .env
```

**Data source (useMocks):**  
- `NUXT_USE_MOCKS=true` (default) — uses JSON files in `mocks/`, no database required.  
- `NUXT_USE_MOCKS=false` — uses Prisma with `DATABASE_URL` (SQLite or PostgreSQL).

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
├── public/              # Static files
├── server/              # Nitro (backend)
│   ├── api/             # API routes
│   ├── middleware/      # Middlewares serveur
│   ├── model/           # MCP
│   └── providers/       # Backends
├── shared/              # Shared code
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

- [ ] Event CRUD
- [ ] Speaker proposals
- [ ] Admin dashboard
- [ ] Public event page with Luma/YouTube integration
- [ ] Backend providers: Supabase + in-memory mock
- [ ] Authentication (magic link)
- [ ] Community members list
- [ ] Deployment template (Vercel/Netlify)

---

## 📜 License

This project is licensed under the [MIT License](./LICENSE).  
Feel free to use, modify, and share — with attribution.

---

## 💬 About

**TheMeetHub** was originally built to manage [Vue Montréal](https://www.vuemtl.com) meetups,  
but is designed to work for any tech or community group around the world.
