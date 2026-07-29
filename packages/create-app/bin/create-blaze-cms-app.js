#!/usr/bin/env node
import { scaffold } from "../dist/index.js";

const args = process.argv.slice(2);

if (args.length === 0 || args[0] === "--help") {
  console.warn(`
Usage: npx @blaze-cms/create-app <project-name>

Creates a new Blaze CMS project with:
  - Firebase config
  - Example collections and globals
  - Build/dev/deploy scripts
`);
  process.exit(0);
}

const projectName = args[0];
scaffold(projectName);
