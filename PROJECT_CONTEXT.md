# 📊 Project Context: Corporate-Wars

## 🎯 Game Objective
Corporate-Wars is a high-stakes Corporate Tycoon/Incremental game. The player takes the role of a CEO building a corporate empire through infrastructure management, talent recruitment, and covert operations. The goal is to maximize Net Flow and dominate the market.

## 🎨 Aesthetic & Vibe
- **Vibe**: Tech-noir / Professional Cyber-Corporate. 
- **UI Style**: Dark mode, high contrast (Emerald for profit, Red for expenses, Blue for tech/upgrades), clean borders, and "Hero" dashboard banners.
- **Experience**: The player should feel like they are looking at a high-end Bloomberg terminal or a secret corporate command center.

## 🕹️ Main Mechanics
- **Infrastructure**: HQ (Headquarters) acts as the heart. Its level dictates the capacity and level caps for other buildings.
- **Human Resources (Staff)**: Specific buildings house specific roles (Programmers in Offices, etc.). Staff generate revenue but cost hourly salaries.
- **The "Economic Squeeze"**: Upgrading buildings increases production but also raises maintenance costs and staff salary demands, forcing the player to optimize efficiency.
- **Liquidity & Crisis**: Players can sell buildings or fire staff at a 50% refund to recover from negative Net Flow.

## 🛠️ Tech Stack & Structure

- **Framework**: Next.js (App Router).
- **Database**: PostgreSQL via Prisma ORM.
- **Authentication/Backend**: Supabase.
- **Styling**: Tailwind CSS.
- **Logic Engine**: Centralized game logic in `src/utils/gameEngine.js`.

### 📂 File System & Responsibilities
- `src/game/constants.js`: **The Bible.** Static data (BUILDINGS, EMPLOYEES), multipliers, levels, and modules placeholders.
- `src/utils/gameEngine.js`: **The Brain.** Calculates "Snapshots" (real-time financial state) combining DB data with Constants.
- `src/utils/economy.js`: Helper functions for financial formatting and calculations.
- `prisma/schema.prisma`: **Database Schema.** Defines the `Company` model and its fields.
- `src/app/dashboard/actions.js`: **Server Actions.** Handles all mutations (buy, hire, upgrade, sell, fire) using strictly defined Mapping Dictionaries.
- `src/components/DashboardControls.js`: Orchestrates the Dashboard UI logic.
- `src/components/Inventory.js`: Visualizes the Infrastructure Tree (HQ -> Buildings).
- `src/components/ui/`: Atomic components (`ActionCard`, `StaffActionCard`).

### 📖 Data Mapping Dictionary (CRITICAL)
*Mandatory naming for Prisma and Logic interactions.*

| Entity (Constant) | DB Count Field | DB Level Field | Building Type / Required |
| :--- | :--- | :--- | :--- |
| `HQ` | `hqCount` | `hqLevel` | Facility (Master) |
| `OFFICE` | `officeCount` | `officeLevel` | Facility |
| `DATACENTER` | `datacenterCount` | `datacenterLevel` | Facility |
| `BASEMENT` | `basementCount` | `basementLevel` | Facility |
| `PROGRAMMER` | `programmers` | N/A | Staff (Needs OFFICE) |
| `ANALYST` | `analysts` | N/A | Staff (Needs DATACENTER) |
| `SABOTEUR` | `saboteurs` | N/A | Staff (Needs BASEMENT) |

## ⚙️ Core Logic Rules
1. **Snapshots**: Never use raw DB data in UI. Always pass it through `calculateGameState` in `gameEngine.js`.
2. **Naming Suffixes**:
    - `{ENTITY}_CONF`: Static configuration (constants).
    - `{ENTITY}_SNAP`: Calculated state (engine).
3. **Refund Policy**: Selling buildings or firing staff returns **50%** of the `basePrice` / `costToHire`.
4. **HQ Dependency**: 
    - `HQ` level determines total `slots` for other buildings.
    - The last `HQ` (count: 1) cannot be sold.
5. **Progression**: Higher building levels = Higher Maintenance + Higher Staff Revenue + Slightly higher Salary.

## 🚀 Development Status
- **Active Phase**: Infrastructure & HR Refinement.
- **Current Features**: Hire/Fire tabs with mass-action sliders, HQ tree visualization, liquidation system.
- **Next Milestone**: Level-based requirements logic (e.g., Office Lv X needed for Basement) and Module/Accessory implementation.