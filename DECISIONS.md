# 📜 Decision Log (DECISIONS.md)

## 🗓️ [2026-04-24] - All-English Codebase
- **Decision**: All technical naming (variables, files, comments) must be in English.
- **Reasoning**: To maintain professional standards, ensure AI compatibility, and follow global development best practices.

## 🗓️ [2026-04-24] - Centralized Game Engine (Snapshot Pattern)
- **Decision**: All game math moved to `gameEngine.js`.
- **Reasoning**: To prevent "Math Drift" where the UI shows one number and the backend processes another. The Snapshot pattern ensures consistency.

## 🗓️ [2026-04-24] - 50% Refund on Liquidation
- **Decision**: Selling infrastructure or firing staff returns only 50% of the initial cost.
- **Reasoning**: To add strategic weight to player decisions and penalize poor financial management, preventing "infinite recycling" of assets.

## 🗓️ [2026-04-24] - Mass Recruitment via Sliders
- **Decision**: UI uses sliders for HR instead of single-click buttons.
- **Reasoning**: Improves UX (Quality of Life) for late-game stages where players need to hire or fire hundreds of units at once.

## 🗓️ [2026-04-24] - HQ as Level Gatekeeper
- **Decision**: HQ level limits the max level of all other buildings.
- **Reasoning**: Creates a clear progression path (Tech Tree) and prevents players from rushing end-game content without building a solid foundation.