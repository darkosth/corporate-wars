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

### 🧱 Coding Standards & Object Integrity
- **NO "ON-THE-FLY" PROPERTIES**: Do not create or attach new properties to an object after its initial declaration.
- **OBJECT BLUEPRINTS**: If an object needs specific properties (even if calculated later), they MUST be defined during the initial declaration with placeholder values (e.g., `0`, `null`, `false`, or `""`).
- **EXPLICIT UPDATES**: Always define the full "shape" of the object at the top of the logic block and then update those existing properties with the actual data.
- **REASONING**: This ensures a predictable data structure (contract), improves V8 engine performance, and prevents "hidden" properties that are hard to track in large components.

### ❌ Bad Practice (On-the-fly)
```javascript
const stats = { gross: 100 };
stats.net = stats.gross - expenses; // Dynamic creation - FORBIDDEN