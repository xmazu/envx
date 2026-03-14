# OpenEnvX - Agent Guidelines

## Project Overview

OpenEnvX is a local-first development runtime for micro-SaaS builders focused on secure environment variable management with encryption. It's a multi-language monorepo combining TypeScript/JavaScript (for web and developer experience) with Go (for performance-critical CLI operations and security).

**Key Philosophy:** Secure by default, local-first, developer-friendly tooling for managing environment secrets.

## Tech Stack

### JavaScript/TypeScript

- **Package Manager:** Bun (v1.3.0)
- **Monorepo:** Turborepo (v2.8.13)
- **Build:** tsup
- **Linting/Formatting:** Biome (v2.4.0) with Ultracite config
- **Versioning:** Changesets
- **Frontend:** Next.js 16, React 19, Tailwind CSS v4
- **UI Components:** shadcn/ui (New York style)
- **Validation:** Zod v4.3.0
- **CLI Framework:** Commander.js + @clack/prompts
- **Testing:** Vitest

### Go

- **Go Version:** 1.24.0
- **CLI Framework:** Cobra
- **TUI:** Charmbracelet (huh, lipgloss, bubbletea)
- **Encryption:** age (X25519), AES-256-GCM
- **MCP Support:** Model Context Protocol Go SDK

## Project Structure

```
/apps/
  └── landing/          # Next.js marketing site
/packages/
  └── openenvx/         # Project generator CLI (openenvx)
/envx/                  # Go CLI for secure env management
```

## Local Development with Portless

This project uses [portless](https://github.com/zuplo/portless) for local development reverse proxy with automatic TLS and named .localhost URLs.

### Installation

```bash
npm install -g portless
```

### Usage

```bash
# Run an app with automatic proxy
portless run next dev
# -> http://<project>.localhost:1355

# Or with explicit name
portless myapp next dev
# -> http://myapp.localhost:1355
```

Add to package.json scripts:

```json
{
  "scripts": {
    "dev": "portless run next dev"
  }
}
```

### Features

- Automatic TLS certificate generation (with `--https`)
- Named .localhost URLs (no more port conflicts)
- Git worktree support (branch names as subdomains)
- Works with Next.js, Vite, Astro, and most frameworks

## Conventions

### File Naming

**TypeScript/JavaScript:**

- Files: `kebab-case.ts` (e.g., `project-generator.ts`)
- Components: `kebab-case.tsx` (e.g., `hero-section.tsx`)
- Templates: `.hbs` extension for Handlebars
- Tests: `.test.ts` suffix

**Go:**

- Files: `snake_case.go` (e.g., `workspace.go`)
- Test files: `_test.go` suffix
- Packages: lowercase single word

### Code Style

**TypeScript:**

- Use `node:` prefix for built-ins (`node:path`, `node:fs`)
- Prefer `import type` for type-only imports
- Named exports preferred over default exports
- Use Zod for runtime validation
- Custom error classes for domain errors

**Go:**

- Explicit error returns, no panic in production code

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

## Local Package Development with Verdaccio

The example app (`/example`) is generated using the `packages/openenvx` CLI and consumes packages published to a local Verdaccio registry.

### Overview

- **Example App Location**: `/example/apps/admin/`
- **Package**: `@openenvx/admin` is published locally to Verdaccio
- **Registry URL**: `http://localhost:4873`
- **Configuration**: `verdaccio.yaml`

### Running Verdaccio

1. **Start the Verdaccio server**:
   ```bash
   npx verdaccio --config verdaccio.yaml
   ```
   The registry will be available at `http://localhost:4873`

2. **Build and publish packages to local registry**:
   ```bash
   # Build the admin package
   cd packages/admin
   bun run build
   
   # Publish to local verdaccio
   npm publish --registry http://localhost:4873
   ```

3. **Install packages in example app from Verdaccio**:
   ```bash
   cd example/apps/admin
   bun install
   ```

The example app's `.npmrc` is configured to fetch `@openenvx` packages from the local registry:
```
@openenvx:registry=http://localhost:4873
```

### Development Workflow

When making changes to `@openenvx/admin`:

1. Make changes to the package source
2. Bump the version in `packages/admin/package.json` if needed
3. Build: `bun run build`
4. Publish to Verdaccio: `npm publish --registry http://localhost:4873`
5. Update the version in `example/apps/admin/package.json`
6. Reinstall in example app: `bun install`

