# 🗺️ Corporate-Wars: Project Context Map

## 📂 Project Structure & Responsibilities

### 🎮 Core Logic & Data
- `src/game/constants.js`: **The Bible.** Contains all static data (BUILDINGS, EMPLOYEES), multipliers, levels, and modules placeholders.
- `src/utils/gameEngine.js`: **The Brain.** Calculates "Snapshots" (real-time financial state) combining DB data with Constants.
- `src/utils/economy.js`: Helper functions for financial formatting and calculations.
- `prisma/schema.prisma`: **Database Schema.** Defines the `Company` model and its fields.

### ⚡ Server Actions (The Bridge)
- `src/app/dashboard/actions.js`: Handles all mutations (buyFacility, hireStaff, upgradeFacility, sellFacility, fireStaff). Uses strictly defined Mapping Dictionaries.

### 🖥️ UI Layer (React Components)
- `src/components/DashboardControls.js`: Orchestrates the Dashboard UI logic.
- `src/components/Inventory.js`: Visualizes the Infrastructure Tree (HQ -> Buildings).
- `src/components/ui/ActionCard.js`: Generic card for building actions (with Sell/Buy logic).
- `src/components/ui/StaffActionCard.js`: Specialized card for HR with Hire/Fire tabs and Sliders.
- `src/components/Sidebar.js` & `TopBar.js`: Layout and navigation.

---

## 📖 Data Mapping Dictionary (CRITICAL)
*Use these exact names when interacting with Prisma or Logic.*

### 🏗️ Infrastructure Mapping
| Game ID (Constant) | DB Count Field | DB Level Field | Building Type |
| :--- | :--- | :--- | :--- |
| `HQ` | `hqCount` | `hqLevel` | Facility |
| `OFFICE` | `officeCount` | `officeLevel` | Facility |
| `DATACENTER` | `datacenterCount` | `datacenterLevel` | Facility |
| `BASEMENT` | `basementCount` | `basementLevel` | Facility |

### 👥 Staff Mapping
| Game ID (Constant) | DB Count Field | Required Building |
| :--- | :--- | :--- |
| `PROGRAMMER` | `programmers` | `OFFICE` |
| `ANALYST` | `analysts` | `DATACENTER` |
| `SABOTEUR` | `saboteurs` | `BASEMENT` |

---

## ⚙️ Core Logic Rules
1. **Snapshots**: Never use raw DB data in UI. Always pass it through `calculateGameState`.
2. **Refund Policy**: Selling buildings or firing staff returns **50%** of the `basePrice` / `costToHire`.
3. **HQ Dependency**: 
   - `HQ` level determines the total `slots` for other buildings.
   - Buildings cannot be upgraded beyond the current `HQ` capability (Roadmap).
   - The last `HQ` (count: 1) cannot be sold.
4. **Economic Squeeze**:
   - Higher building levels = Much higher Maintenance.
   - Higher building levels = Higher Staff Revenue but slightly higher Salary.

---

## 🚀 Active Phase: Infrastructure & HR Refinement
- **Current Status**: Hire/Fire tabs implemented, Mass recruitment/firing via slider, HQ tree visualization.
- **Next Milestone**: Module/Accessory implementation and Level Requirements logic.