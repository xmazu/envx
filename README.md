# EnvX

**.env enhanced. Secured. Local-first. Agent-ready by design.**

Zero-configuration secret management. Your keys, your data-Vault-style envelope encryption that runs on your machine. Built for developers and AI agents.

Unbiased. No vendor lock-in. No accounts. No cloud required.

Made for people, by people. Fully open source.

> ⚠️ **Early Development**: This tool is currently in early development. Features and APIs may change.

---

## Quick Start

```bash
# Install (macOS and Linux)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/xmazu/envx/main/scripts/install.sh)"

# Initialize workspace (creates keypair + encrypts .env files)
envx init

# Store a secret
envx set DATABASE_URL

# Run with decrypted env
envx run -- npm start
```

Or install via Go: `go install github.com/xmazu/envx@latest`

---

## Variable expansion & command substitution

Values in your `.env` are expanded when you run commands or use `envx get`. Two forms are supported:

### Variable references: `${VAR}`

Reference other keys in the same env (or from earlier files when using multiple files). Resolved after command substitution.

```bash
USER=alice
HOME_DIR=${HOME}
DB_URL=postgres://${USER}@localhost/mydb
```

Circular references and undefined variables cause an error.

### Command substitution: `$(command)`

Run a shell command and use its stdout (trimmed) as the value. Commands run with a **minimal environment** (only `PATH`, `HOME`, `USER`, `LANG`) so they cannot access secrets from the parent process. Resolved first, so you can combine with `${VAR}`.

```bash
# Inject current user or hostname
CURRENT_USER=$(whoami)
HOSTNAME=$(hostname)

# Use in another variable
GREET=hello-${CURRENT_USER}
```

Nested parentheses are supported, e.g. `$(echo "$(whoami)")`. Empty `$()` or a failing command returns an error.

---

## Useful commands & tricks

### Multiple env files

Compose env from several files; later files override earlier ones unless you avoid overload:

```bash
# Default: later files only fill in missing keys (no override)
envx run -f .env -f .env.local -- npm start

# Let later files and --env override earlier values
envx run -f .env -f .env.local --overload -- npm start
```

Handy for local overrides (e.g. `.env.local`), per-environment files (e.g. `.env.production`), or splitting shared vs. secret keys.

### Override or add vars at run time

```bash
envx run -e NODE_ENV=test -e PORT=3001 -- npm test
```

Combine with `-f` and `--overload` so `-e` can override file values when needed.

### Get a single value for scripts

```bash
# Raw value (e.g. for scripts)
export API_KEY=$(envx get API_KEY)

# Shell-friendly (key=value)
eval "$(envx get --format eval)"
```

### Redact secrets in command output

Useful when an agent or log should see that a secret is present but not its value:

```bash
envx run --redact -- npm start
```

Output is rewritten so secret values appear as `[REDACTED:KEY]`.

### Strict mode and watching

Fail if any env file is missing or decryption fails (e.g. in CI):

```bash
envx run -f .env -f .env.production --strict -- npm start
```

Auto-restart when `.env` changes (default for dev-server-like commands); disable with `--no-watch`:

```bash
envx run --no-watch -- python server.py
```

---

## Security Architecture

### Envelope Encryption

Every secret gets its own Data Encryption Key (DEK):

```
Secret Value → Random DEK → AES-256-GCM → Ciphertext
                     │                           │
                     └─ Wrapped by Master Key ←─┘
```

- **Master Key**: 256-bit key derived from age private key via HMAC-SHA256
- **DEK**: 256-bit random key, unique per secret
- **Algorithm**: AES-256-GCM with random nonces
- **Associated Data**: Key names used for authentication (AEAD)

### File Format

```ini
DATABASE_URL=envx:<base64-wrapped-dek>:<base64-ciphertext>
API_KEY=envx:<base64-wrapped-dek>:<base64-ciphertext>
```

### Key Storage

- **Public key**: Stored in `.envx.yaml` at workspace root (safe to commit)
- **Private key**: Stored in `~/.config/envx/keys.yaml` (never commit)
- **Resolution**: Environment variable `ENVX_PRIVATE_KEY` takes precedence

### Audit Logging

All envelope and secret operations logged with hash-chaining:

```bash
envx audit show --last=20
envx audit verify
```

Stored in `.envx/audit.logl`. Each entry includes a SHA-256 hash of the previous entry for tamper detection.

---

## Security & Scanning

Scan your repository for leaked secrets before they reach git:

```bash
# Scan current directory
envx scan

# Scan specific path
envx scan --path ./src

# CI-friendly (fails on high-severity findings)
envx scan
```

Detects API keys, tokens, passwords, and other sensitive patterns. Respects `.gitignore` exclusions.

---

## FAQ

**Q: Is the `.env` file really safe to commit?**  
A: Yes. It only contains the public key (which is meant to be public) and encrypted ciphertext. Without the private key, it's useless.

**Q: What if I lose my private key?**  
A: Your secrets are gone. There's no backdoor. Store your private key safely (1Password, hardware key, etc.).

---

MIT License · [GitHub](https://github.com/xmazu/envx)