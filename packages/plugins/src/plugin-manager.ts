import type { PluginDefinition, PluginRegistration, FieldDefinition } from "@blazing-cms/types";

type HookHandler = (...args: unknown[]) => Promise<void>;

export class PluginManager {
  private plugins = new Map<string, PluginRegistration>();
  private hookHandlers: Map<string, HookHandler[]> = new Map();

  register(plugin: PluginDefinition, options?: Record<string, unknown>): void {
    this.plugins.set(plugin.slug, { options, plugin });
    if (plugin.hooks?.beforeSchemaLoad) {
      this.addHook("beforeSchemaLoad", plugin.hooks.beforeSchemaLoad as HookHandler);
    }
    if (plugin.hooks?.afterSchemaLoad) {
      this.addHook("afterSchemaLoad", plugin.hooks.afterSchemaLoad as HookHandler);
    }
    if (plugin.hooks?.beforeRouteRegister) {
      this.addHook("beforeRouteRegister", plugin.hooks.beforeRouteRegister as HookHandler);
    }
    if (plugin.hooks?.afterRouteRegister) {
      this.addHook("afterRouteRegister", plugin.hooks.afterRouteRegister as HookHandler);
    }
  }

  unregister(slug: string): void {
    this.plugins.delete(slug);
  }

  get(slug: string): PluginRegistration | undefined {
    return this.plugins.get(slug);
  }

  getAll(): PluginRegistration[] {
    return Array.from(this.plugins.values());
  }

  getCustomFields(): Record<string, FieldDefinition[]> {
    const result: Record<string, FieldDefinition[]> = {};
    for (const [, reg] of this.plugins) {
      if (reg.plugin.customFields) {
        for (const [collection, fields] of Object.entries(reg.plugin.customFields)) {
          result[collection] = [...(result[collection] ?? []), ...fields];
        }
      }
    }
    return result;
  }

  getAdminPanels(): Array<{
    slug: string;
    label: string;
    icon?: string;
    component: string;
    plugin: string;
  }> {
    const panels: Array<{
      slug: string;
      label: string;
      icon?: string;
      component: string;
      plugin: string;
    }> = [];
    for (const [, reg] of this.plugins) {
      const panelsForPlugin = panelEntriesForPlugin(reg);
      panels.push(...panelsForPlugin);
    }
    return panels;
  }

  async runHook(hookName: string, ...args: unknown[]): Promise<void> {
    const handlers = this.hookHandlers.get(hookName);
    if (!handlers) return;
    for (const handler of handlers) {
      await handler(...args);
    }
  }

  private addHook(name: string, handler: HookHandler): void {
    const handlers = this.hookHandlers.get(name) ?? [];
    handlers.push(handler);
    this.hookHandlers.set(name, handlers);
  }
}

function panelEntriesForPlugin(
  reg: PluginRegistration,
): Array<{ slug: string; label: string; icon?: string; component: string; plugin: string }> {
  if (!reg.plugin.adminPanels) return [];
  return reg.plugin.adminPanels.map((panel) => ({
    component: panel.component,
    label: panel.label,
    plugin: reg.plugin.slug,
    slug: panel.slug,
    ...(panel.icon !== undefined ? { icon: panel.icon } : {}),
  }));
}
