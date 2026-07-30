# Content Specification

## Purpose

Provides content management for collections and globals, with a Firebase-native architecture where the admin panel and generated SDK talk directly to Firestore via the Firebase client SDK.

## Requirements

### Requirement: Content is stored in Firestore collections

The system SHALL store collection entries in Firestore documents under collection names prefixed with `collections_`, and globals under `globals_` with a fixed document ID of `value`.

#### Scenario: Collection entry document

- **WHEN** a new entry is created in the "posts" collection
- **THEN** it is stored in the `collections_posts/{docId}` Firestore collection

#### Scenario: Global document

- **WHEN** a global "site-settings" is saved
- **THEN** it is stored at `globals_site-settings/value` in Firestore

#### Scenario: Schema metadata

- **WHEN** schema definitions are synced
- **THEN** they are stored under the `_schemas` Firestore collection

### Requirement: Entries have timestamps

The system SHALL set `createdAt` and `updatedAt` timestamps on every entry and global document.

#### Scenario: Created timestamp on insert

- **WHEN** a new entry is created
- **THEN** `createdAt` and `updatedAt` are set to the current timestamp

#### Scenario: Updated timestamp on modification

- **WHEN** an existing entry is updated
- **THEN** `updatedAt` is refreshed to the current timestamp

#### Scenario: Timestamps are ISO strings

- **WHEN** reading data through the client SDK
- **THEN** timestamps are represented as ISO 8601 strings

### Requirement: The client SDK provides a per-collection CRUD API

The system SHALL provide a client SDK with per-collection methods for `findMany`, `findById`, `create`, `update`, and `delete`, communicating directly with Firestore.

#### Scenario: SDK findMany with cursor pagination

- **WHEN** `findMany` is called with a limit
- **THEN** the SDK fetches `limit + 1` documents and returns `limit` in `data` with a `hasMore` flag and optional `cursor`

#### Scenario: SDK findMany with filters

- **WHEN** `findMany` is called with filters using operators like `==`, `>`, `<`, `in`, `array-contains`
- **THEN** the SDK applies the filters to the Firestore query

#### Scenario: SDK findById

- **WHEN** `findById` is called with a document ID
- **THEN** the SDK reads the document from Firestore and returns it with its `id`, or `null` if not found

#### Scenario: SDK create with custom ID

- **WHEN** `create` is called with data that includes an `id` field
- **THEN** the SDK creates the document with that ID using `setDoc`

#### Scenario: SDK create with auto-generated ID

- **WHEN** `create` is called without an `id` field
- **THEN** the SDK uses `addDoc` and returns the auto-generated document ID

#### Scenario: SDK update strips ID

- **WHEN** `update` is called with data that includes an `id` field
- **THEN** the SDK strips the `id` before writing to Firestore

#### Scenario: SDK delete

- **WHEN** `delete` is called with a document ID
- **THEN** the SDK calls `deleteDoc` on the Firestore document

### Requirement: The client SDK provides globals API

The system SHALL provide a globals API with `get` and `upsert` methods.

#### Scenario: Get global

- **WHEN** a global is requested by slug
- **THEN** the SDK reads the document at `globals_{slug}/value`

#### Scenario: Upsert global

- **WHEN** a global is saved
- **THEN** the SDK uses `setDoc` with `{ merge: true }` at `globals_{slug}/value`

### Requirement: The admin panel supports two data provider modes

The admin panel SHALL support `firebase` (default, browser Firestore) and `mock` (in-memory Map for dev/testing) provider modes.

#### Scenario: Firebase mode

- **WHEN** `VITE_BACKEND_MODE` is `firebase` or unset
- **THEN** the admin panel uses the Firebase Firestore client SDK for all data operations

#### Scenario: Mock mode

- **WHEN** `VITE_BACKEND_MODE` is `mock`
- **THEN** the admin panel uses an in-memory Map store for development without a network
