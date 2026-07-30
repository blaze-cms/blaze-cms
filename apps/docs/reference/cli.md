# CLI Reference

The `cms` CLI is available via `@blazing-cms/cms`.

```bash
cms <command> [options]
```

## Commands

### `cms dev`

Start the development server.

```bash
cms dev [--port <port>] [--host <host>]
```

- `--port` — Port number (default: 5173)
- `--host` — Host address (default: localhost)

When `VITE_BACKEND_MODE=firebase`, schemas are auto-synced to Firestore on startup.

### `cms build`

Build the admin panel for production.

```bash
cms build
```

### `cms generate`

Generate types, SDK, and validation schemas from your schema files.

```bash
cms generate [--types] [--sdk] [--validation]
```

If no flags are given, all outputs are generated.

### `cms lint`

Validate schema files for correctness.

```bash
cms lint
```

### `cms doctor`

Check project health — verifies configuration, dependencies, and schema integrity.

```bash
cms doctor
```
