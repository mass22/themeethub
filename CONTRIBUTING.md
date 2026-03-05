# Contributing to TheMeetHub

We welcome contributions from developers of all skill levels. This guide will help you get started.

---

## 🚀 Quick Start

1. **Fork** the repository and clone your fork
2. **Install** dependencies: `npm install`
3. **Copy** `.env.example` to `.env` and configure (see [README](./README.md#3-configure-environment))
4. **Run** the dev server: `npm run dev`

By default, the app uses JSON mocks (`NUXT_USE_MOCKS=true`), so no database setup is required.

---

## 📋 How to Contribute

### Reporting a Bug

Open an [issue](https://github.com/mass22/themeethub/issues) with:

- A clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Your environment (Node version, OS)

### Suggesting a Feature

Open an issue with the `enhancement` label. Describe the use case and why it would benefit the project.

### Submitting Code

1. Create a branch: `git checkout -b feature/my-feature` or `fix/bug-description`
2. Make your changes
3. Run the checks (see below)
4. Commit: `git commit -m "feat: add my feature"` (prefer [Conventional Commits](https://www.conventionalcommits.org/))
5. Push: `git push origin feature/my-feature`
6. Open a **Pull Request** and describe your changes

---

## ✅ Checks Before Submitting

Run these before opening a PR:

```bash
# Lint
npm run lint

# Unit & integration tests
npm run test:frontend
npm run test:backend
npm run test:integration
```

If you modify API routes or server logic, ensure integration tests pass. For UI changes, E2E tests (`npm run test:e2e`) may be relevant.

---

## 📁 Project Structure

- `app/` — Nuxt app (pages, components, composables, layouts)
- `server/` — Nitro API routes, MCP, providers
- `mocks/` — JSON mock data (when `NUXT_USE_MOCKS=true`)
- `prisma/` — Schema and migrations (when using a database)
- `tests/` — Unit, integration, and E2E tests

---

## 🌐 i18n

The app supports **French** (default) and **English**. When adding or changing UI text, update both `i18n/locales/fr.json` and `i18n/locales/en.json`.

---

## 📜 License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).

---

Thanks for contributing to TheMeetHub! 🎉
