# Defining Schemas

Blazing CMS uses TypeScript schema files as the source of truth. Three types of schemas are available:

## Collections

Collections represent content types with multiple entries (like database tables).

```ts
import { defineCollection, text, number, boolean, date } from "@blazing-cms/schema";

export const products = defineCollection({
  slug: "products",
  fields: [
    text("name", { required: true }),
    number("price"),
    boolean("inStock"),
    date("availableFrom"),
  ],
});
```

## Globals

Globals represent singleton content (like site settings).

```ts
import { defineGlobal, text, media, color } from "@blazing-cms/schema";

export const siteSettings = defineGlobal({
  slug: "site-settings",
  label: "Site Settings",
  fields: [
    text("siteName"),
    media("logo"),
    color("brandColor"),
  ],
});
```

## Components

Components are reusable field groups that can be embedded in other schemas.

```ts
import { defineComponent, text, textarea } from "@blazing-cms/schema";

export const seo = defineComponent({
  slug: "seo",
  label: "SEO",
  fields: [
    text("title"),
    textarea("description"),
  ],
});
```

## Field Types

| Type | Description |
|------|-------------|
| `text` | Single-line text |
| `textarea` | Multi-line text |
| `richText` | Rich text editor (Tiptap) |
| `markdown` | Markdown editor |
| `code` | Code editor (CodeMirror) |
| `number` | Numeric input |
| `boolean` | Toggle/checkbox |
| `date` | Date picker |
| `datetime` | Date and time picker |
| `email` | Email input |
| `password` | Password input |
| `url` | URL input |
| `json` | JSON editor |
| `color` | Color picker |
| `media` | Media/file picker |
| `select` | Dropdown select |
| `multiSelect` | Multi-select |
| `radio` | Radio buttons |
| `checkbox` | Checkbox group |
| `relation` | Relation to another collection |
| `component` | Inline component |
| `dynamicZone` | Dynamic zone (choose component) |
| `array` | Repeating array of fields |
| `object` | Nested object |
| `group` | Grouped fields |
| `repeater` | Repeatable group |
| `tabs` | Tabbed interface |
| `slug` | Auto-generated slug |

## Validation

Most field types accept validation options:

```ts
text("title", {
  required: true,
  validation: {
    minLength: 3,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9 ]+$/,
  },
})
```
