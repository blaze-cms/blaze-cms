# CLI Reference

The `blaze` CLI is available via `@blazing-cms/cms`.

```bash
blaze <command> [options]
```

## Commands

### `blaze dev`

Start the development server.

```bash
blaze dev [--port <port>] [--host <host>] [--emulator]
```

- `--port` — Port number (default: 5173)
- `--host` — Host address (default: localhost)
- `--emulator` — Start Firebase Emulator alongside the dev server

On startup, schemas are loaded from the `cms/` directory, code generation runs, and the admin panel is served via Vite at `http://localhost:5173/`.

### `blaze build`

Build the admin panel for production.

```bash
blaze build
```

### `blaze generate`

Generate types, SDK, validation schemas, Firestore rules, and indexes from your schema files.

```bash
blaze generate [type]
```

Where `type` is one of: `types`, `sdk`, `validation`, `registry`, `rules`, `indexes`. If omitted, all outputs are generated.

### `blaze deploy`

Deploy the admin panel to Firebase Hosting.

```bash
blaze deploy --project <project-id>
```

- `--project` — Firebase project ID

### `blaze scaffold`

Scaffold a new collection, global, or component.

```bash
blaze scaffold <type> --name <slug>
```

- `type` — `collection`, `global`, or `component`
- `--name` — Schema slug

### `blaze lint`

Validate schema files for correctness.

```bash
blaze lint
```

### `blaze doctor`

Check project health — verifies configuration, dependencies, and schema integrity.

```bash
blaze doctor
```
