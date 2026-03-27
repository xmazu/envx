# OpenEnvX - Agent Guidelines

- ALWAYS USE PARALLEL TOOLS WHEN APPLICABLE.
- The default branch in this repo is `main`.
- Prefer automation: execute requested actions without confirmation unless blocked by missing info or safety/irreversibility.
- You may be running in a git worktree. All changes must be made in your current working directory - never modify files in the main repo checkout.

## Tech Stack

### JavaScript/TypeScript

- **Package Manager:** Bun 
- **Monorepo:** Turborepo
- **Build:** rolldown
- **Linting/Formatting:** Biome with Ultracite config
- **Frontend:** Next.js 16, React 19, Tailwind CSS v4
- **UI Components:** shadcn/ui 
- **Validation:** Zod
- **CLI Framework:** Commander.js + @clack/prompts
- **Testing:** Vitest

## Project Structure

```
/apps/
  └── landing/          # Next.js marketing site
/packages/
  └── openenvx/         # Project generator CLI (openenvx)
```


## Conventions

### File Naming

- Files: `kebab-case.ts` (e.g., `project-generator.ts`)
- Components: `kebab-case.tsx` (e.g., `hero-section.tsx`)
- Templates: `.hbs` extension for Handlebars
- Tests: `.test.ts` suffix

### Code Style

- Use `node:` prefix for built-ins (`node:path`, `node:fs`)
- Prefer `import type` for type-only imports
- Named exports preferred over default exports
- Use Zod for runtime validation
- Custom error classes for domain errors

## Do's

- **Use Biome for linting/formatting** - Don't bypass the configured linter
- **Write tests for new features** - Vitest for JS, table-driven tests for Go
- **Use Changesets for versioning** - Always create a changeset for published packages
- **Use `node:` prefix** for Node.js built-in modules
- **Validate with Zod** at runtime boundaries
- **Handle errors explicitly** in Go (no panics in production paths)
- **Use async generators** for CLI progress reporting when appropriate
- **Follow existing naming conventions** in each language
- **Use TypeScript strict mode** - leverage the type system
- **Prefer explicit types** over `any` or implicit types

## Don'ts

- **Don't commit secrets** - The entire point is secure secret management
- **Don't use default exports** unnecessarily
- **Don't panic in Go** except in `main()` or `init()`
- **Don't mix sync/async** without clear intent
- **Don't modify `package-lock.json`** - this project uses Bun
- **Don't create circular dependencies** between packages

## Package Publishing

Packages are published to npm:

- `openenvx` - Project generator CLI