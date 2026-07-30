# Plugins Specification

## Purpose

Provides an extension system for the CMS where third-party packages can add custom fields to existing collections and register admin UI panels, hooking into the schema loading lifecycle.

## Requirements

### Requirement: Plugins are discovered by naming convention

The system SHALL discover plugin packages in `node_modules` by matching the naming pattern `blazing-cms-plugin-*` or `@scope/blazing-cms-plugin-*`.

#### Scenario: Discover unscoped plugins

- **WHEN** the system scans `node_modules` for plugins
- **THEN** it matches packages named `blazing-cms-plugin-*` and attempts to load them

#### Scenario: Discover scoped plugins

- **WHEN** a scope filter (e.g., `@myorg`) is provided
- **THEN** the system matches packages named `@myorg/blazing-cms-plugin-*`

#### Scenario: Failed plugin load is non-fatal

- **WHEN** a matching package fails to import
- **THEN** the system skips it silently and continues with remaining plugins

### Requirement: Plugins are declarative data objects

The system SHALL define a plugin as a data object with a `slug`, `name`, `enabled` flag, and optional hooks, custom fields, and admin panels.

#### Scenario: Minimal plugin definition

- **WHEN** a package's default export is an object with `slug`, `name`, and `enabled: true`
- **THEN** the system recognizes it as a valid plugin

#### Scenario: Plugin with all optional fields

- **WHEN** a plugin includes `description`, `version`, `hooks`, `customFields`, and `adminPanels`
- **THEN** all fields are stored and available for system integration

#### Scenario: Disabled plugin is registered but inactive

- **WHEN** a plugin has `enabled: false`
- **THEN** the system still registers it but does not execute its hooks or apply its custom fields

### Requirement: Plugins can extend schemas with custom fields

The system SHALL allow plugins to inject additional fields into existing collections via the `customFields` property.

#### Scenario: Custom fields on a collection

- **WHEN** a plugin defines `customFields` keyed by collection slug with field definitions
- **THEN** those fields are merged into the collection's field list for rendering and validation

#### Scenario: Custom fields across multiple collections

- **WHEN** a plugin defines custom fields for multiple collection slugs
- **THEN** each collection receives its respective additional fields

### Requirement: Plugins can register admin UI panels

The system SHALL allow plugins to register additional admin UI pages via the `adminPanels` property.

#### Scenario: Plugin admin panel

- **WHEN** a plugin defines an `adminPanels` entry with a slug, label, icon, and component path
- **THEN** a navigation entry is added to the admin sidebar pointing to the plugin's component

### Requirement: Plugins hook into the schema lifecycle

The system SHALL execute plugin hooks before and after schema loading.

#### Scenario: Before schema load

- **WHEN** the system begins loading schema definitions
- **THEN** it calls all registered `beforeSchemaLoad` hooks in registration order

#### Scenario: After schema load

- **WHEN** schema definitions have been loaded
- **THEN** it calls all registered `afterSchemaLoad` hooks with the loaded collections, globals, and components

#### Scenario: Hooks run sequentially

- **WHEN** multiple plugins are registered with the same hook
- **THEN** they execute in registration order, each awaiting completion before the next starts

### Requirement: Plugins can be registered with per-plugin options

The system SHALL accept an optional configuration object per plugin when registering.

#### Scenario: Plugin registration with options

- **WHEN** a plugin is registered with a configuration object
- **THEN** the options are stored and accessible via the plugin registration

#### Scenario: Plugin registration without options

- **WHEN** a plugin is registered without a configuration object
- **THEN** the plugin is stored with an empty options object

### Requirement: The plugin manager supports querying

The system SHALL provide methods to retrieve registered plugins, their custom fields, and their admin panels.

#### Scenario: Get all plugins

- **WHEN** all plugins are queried
- **THEN** the system returns all registered plugin registrations

#### Scenario: Get plugin by slug

- **WHEN** a plugin is queried by its slug
- **THEN** the system returns the plugin registration or `undefined` if not found

#### Scenario: Get aggregated custom fields

- **WHEN** custom fields from all plugins are queried
- **THEN** the system returns a merged record of field definitions keyed by collection slug

#### Scenario: Get aggregated admin panels

- **WHEN** admin panels from all plugins are queried
- **THEN** the system returns a merged array of all plugin admin panel definitions

### Requirement: Plugins can be unregistered

The system SHALL support removing a registered plugin by its slug.

#### Scenario: Unregister plugin

- **WHEN** a plugin is unregistered by slug
- **THEN** the plugin is removed and its hooks are no longer executed
