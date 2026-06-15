# Agent Instructions for DateDreamer Monorepo

This document provides context, roles, and operational guidelines for AI agents (LLMs, sub-agents, and automated tools) working within the DateDreamer monorepo.

## 🏗️ Project Overview

DateDreamer is a headless UI architecture. The primary goal is to maintain a strict separation between core business logic/state and framework-specific presentation layers.

### Architecture Layers
1.  **Core Layer (`@datedreamer/core`)**: The "Source of Truth". Contains pure TypeScript logic, state machines, and data models. It has **zero** dependencies on the DOM or any UI framework.
2.  **Design System (`@datedreamer/theme`)**: The visual language. Defines CSS variables, design tokens, and styling primitives.
3.  **Foundation Layer (`@datedreamer/web-components`)**: Standard Web Components that consume the Theme and Core. These serve as the baseline for all other implementations.
4.  **Adapter Layer (`@datedreamer/react`, `@datedreamer/vue`, `@datedreamer/angular`)**: Framework-specific wrappers around the Web Components and Core logic. These provide the "idiomatic" experience for developers using these frameworks (e.g., React Hooks, Vue Composables).

---

## 🤖 Agent Roles

### Core Logic Engineer
*   **Focus**: `@datedreamer/core`, `@datedreamer/theme`.
*   **Responsibility**: Implementing state transitions, data models, and design tokens.
*   **Constraint**: **NEVER** import from `@datedreamer/react`, `@datedreamer/vue`, `@datedreamer/angular`, or any web-component-specific package. Ensure logic is pure and highly testable.

### UI/Component Engineer
*   **Focus**: `@datedreamer/web-components`, `@datedreamer/theme`.
*   **Responsibility**: Implementing the visual representation of components using the design system.
*   **Constraint**: All components must be accessible, performant, and strictly adhere to the CSS variables defined in `@datedreamer/theme`.

### Framework Adapter Engineer
*   **Focus**: `@datedreamer/react`, `@datedreamer/vue`, `@datedreamer/angular`.
*   **Responsibility**: Creating seamless, idiomatic DX for framework users.
*   **Constraint**: Do not re-implement logic already present in `@datedreamer/core`. Your job is to "wrap" and "expose" existing functionality in a way that feels natural to the specific framework.

---

## 🛠️ Development Workflow

### Commands
*   **Install**: `pnpm install`
*   **Build All**: `pnpm build`
*   **Test All**: `pnpm test`
*   **Lint**: `pnpm lint`

### Core Principles
*   **Headless First**: If a new feature is requested, ask: "Can this be implemented in `@datedreamer/core` first?"
*   **Single Source of Truth**: If a piece of logic exists in `core`, it must not be duplicated in an adapter.
*   **CSS Variables for Theming**: Never hardcode colors or spacing in component files. Always use the tokens provided by `@datedreamer/theme`.
*   **Type Safety**: All packages must maintain strict TypeScript configuration.

## 🔍 Troubleshooting & Verification

Before reporting a fix or a completed feature, an agent should:
1.  Run `pnpm test` in the relevant package.
2.  If the change is cross-package, run `pnpm build` from the root.
3.  Verify that no accidental circular dependencies were introduced between the Core and Adapter layers.
