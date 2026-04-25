# 🤖 AI Agent Guidelines (AGENTS.md)

## 🌐 Language & Naming Conventions
- **STRICT RULE**: All code, variable names, function names, folder structures, and code comments MUST be in **English**. 
- Use descriptive naming (e.g., `calculateTotalRevenue` instead of `calcRev`).

## 🔄 Workflow & Atomicity
- **Atomic Changes**: Perform small, safe, and incremental changes. Do not attempt to refactor the entire project in one go.
- **Pre-flight Check**: Before applying changes, list which files will be modified and explain the reasoning.
- **No Overwriting**: Do not rewrite entire files if only a specific function needs a fix. Use targeted updates to preserve existing logic.

## 📦 Dependencies & Environment
- **Library Lock**: No new libraries or packages are allowed to be installed without explicit permission from the lead developer.
- **Stack Integrity**: Always stick to the current stack (Next.js, Tailwind, Prisma, Supabase).

## 🛡️ Validation & Architecture
- **Sanity Check**: After every change, verify if the new logic breaks the game engine's "Snapshot" pattern or the database schema.
- **State Integrity**: Ensure that financial calculations always go through the `gameEngine.js` to maintain a single source of truth.